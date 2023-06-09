// SPDX-License-Identifier: GPL-3.0

// Based on contracts in https://github.com/jchittoda/eth-atomic-swap

pragma solidity ^0.8.18;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AtomicCloak {
    struct Swap {
        uint256 timelock;
        address tokenContract;
        uint256 value;
        address payable sender;
        address payable recipient;
        bytes32 secretKey;
        Fees fee;
    }

    enum States {
        INVALID,
        OPEN,
        CLOSED,
        EXPIRED
    }

    enum Fees {
        NONE,
        QUICK,
        NORMAL
    }

    mapping(address => Swap) private swaps;
    mapping(address => States) private swapStates;
    address immutable ETH_TOKEN_CONTRACT = address(0x0);
    uint256 immutable gx =
        0xa6ecb3f599964fe04c72e486a8f90172493c21f4185f1ab9a7fe05659480c548;
    uint256 immutable gy =
        0xdf67fd3f4255826c234a5262adc70e14a6d42f13ee55b65e885e666e1dd5d3f5;
    uint8 immutable gyParity = 28; //==gy % 2 != 0 ? 28 : 27
    uint256 immutable curveOrder =
        0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;

    event Open(address _swapID, address _recipient);
    event Expire(address _swapID);
    event Close(address _swapID, bytes32 _secretKey);

    modifier onlyInvalidSwaps(address _swapID) {
        require(swapStates[_swapID] == States.INVALID);
        _;
    }

    modifier onlyOpenSwaps(address _swapID) {
        require(swapStates[_swapID] == States.OPEN);
        _;
    }

    modifier onlyClosedSwaps(address _swapID) {
        require(swapStates[_swapID] == States.CLOSED);
        _;
    }

    modifier onlyExpirableSwaps(address _swapID) {
        require(block.timestamp >= swaps[_swapID].timelock);
        _;
    }

    modifier onlyWithSecretKey(address _swapID, bytes32 _secretKey) {
        // Use Schnorr verification;
        // Note: _swapID is actually the commitment
        require(ecmulVerify(_secretKey, _swapID));
        // require(_swapID == sha256(_secretKey)); This is the usual HTLC way.
        _;
    }

    function ecmulVerify(
        bytes32 _secretKey,
        address _swapID
    ) public pure returns (bool) {
        return getHashedCommitment(_secretKey) == _swapID;
    }

    function getHashedCommitment(
        bytes32 _secretKey
    ) public pure returns (address) {
        address signer = ecrecover(
            0,
            gyParity,
            bytes32(gx),
            bytes32(mulmod(uint256(_secretKey), gx, curveOrder))
        );

        return signer;
    }

    function commitmentToAddress(
        bytes32 _qx,
        bytes32 _qy
    ) public pure returns (address) {
        address _addr = address(
            uint160(
                uint256(keccak256(abi.encodePacked(_qx, _qy))) &
                    0x00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
            )
        );
        return _addr;
    }

    function openETH(
        bytes32 _qx,
        bytes32 _qy,
        address payable _recipient,
        uint256 _timelock
    ) public payable {
        address _swapID = commitmentToAddress(_qx, _qy);

        // The swapID is used also as commitment
        require(
            swapStates[_swapID] == States.INVALID,
            "Swap has been already opened."
        );
        require(
            _timelock > block.timestamp,
            "Timelock value must be in the future."
        );
        require(msg.value > 0, "Must send ETH.");

        Swap memory swap = Swap({
            timelock: _timelock,
            tokenContract: ETH_TOKEN_CONTRACT,
            value: msg.value,
            sender: payable(msg.sender),
            recipient: _recipient,
            secretKey: bytes32(0),
            fee: Fees.NONE
        });

        swaps[_swapID] = swap;
        swapStates[_swapID] = States.OPEN;

        emit Open(_swapID, _recipient);
    }

    function openERC20(
        bytes32 _qx,
        bytes32 _qy,
        address payable _recipient,
        uint256 _timelock,
        address _tokenAddress,
        uint256 _value
    ) public payable {
        address _swapID = commitmentToAddress(_qx, _qy);
        // The swapID is used also as commitment
        require(
            swapStates[_swapID] == States.INVALID,
            "Swap has been already opened."
        );
        require(
            _timelock > block.timestamp,
            "Timelock value must be in the future."
        );
        require(
            _tokenAddress != ETH_TOKEN_CONTRACT,
            "The address is not a valid ERC20 token."
        );
        require(
            msg.value == 0,
            "Cannot send ETH when swapping an ERC20 token."
        );

        // Transfer value from the ERC20 trader to this contract.
        // These checks are already implied in the ETH case.
        ERC20 erc20Contract = ERC20(_tokenAddress);
        require(
            erc20Contract.allowance(msg.sender, address(this)) >= _value,
            "Not enough balance."
        );
        require(
            erc20Contract.transferFrom(msg.sender, address(this), _value),
            "Transfer failed."
        );

        Swap memory swap = Swap({
            timelock: _timelock,
            tokenContract: _tokenAddress,
            value: msg.value,
            sender: payable(msg.sender),
            recipient: _recipient,
            secretKey: bytes32(0),
            fee: Fees.NONE
        });
        swaps[_swapID] = swap;
        swapStates[_swapID] = States.OPEN;

        emit Open(_swapID, _recipient);
    }

    function close(
        address _swapID,
        bytes32 _secretKey
    ) public onlyOpenSwaps(_swapID) onlyWithSecretKey(_swapID, _secretKey) {
        Swap memory swap = swaps[_swapID];
        swaps[_swapID].secretKey = _secretKey;
        swapStates[_swapID] = States.CLOSED;

        // TODO: implement fees to incentivize closing contracts as fast as possible.
        if (swap.tokenContract == ETH_TOKEN_CONTRACT) {
            // Transfer the ETH funds from this contract to the recipient.
            swap.recipient.transfer(swap.value);
        } else {
            // Transfer the ERC20 funds from this contract to the recipient.
            ERC20 erc20Contract = ERC20(swap.tokenContract);
            require(erc20Contract.transfer(swap.recipient, swap.value));
        }

        emit Close(_swapID, _secretKey);
    }

    function expire(
        address _swapID
    ) public onlyOpenSwaps(_swapID) onlyExpirableSwaps(_swapID) {
        Swap memory swap = swaps[_swapID];
        swapStates[_swapID] = States.EXPIRED;

        if (swap.tokenContract == ETH_TOKEN_CONTRACT) {
            // Transfer the ETH funds from this contract to the sender.
            swap.sender.transfer(swap.value);
        } else {
            // Transfer the ERC20 funds from this contract to the sender.
            ERC20 erc20Contract = ERC20(swap.tokenContract);
            require(erc20Contract.transfer(swap.sender, swap.value));
        }

        emit Expire(_swapID);
    }

    function getSecretKey(
        address _swapID
    ) public view onlyClosedSwaps(_swapID) returns (bytes32 secretKey) {
        Swap memory swap = swaps[_swapID];
        return swap.secretKey;
    }
}
