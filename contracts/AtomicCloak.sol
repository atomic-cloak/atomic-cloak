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
        bytes secretKey;
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

    mapping(bytes32 => Swap) private swaps;
    mapping(bytes32 => States) private swapStates;
    address immutable ETH_TOKEN_CONTRACT = address(0x0);

    event Open(bytes32 _swapID, address _recipient);
    event Expire(bytes32 _swapID);
    event Close(bytes32 _swapID, bytes _secretKey);

    modifier onlyInvalidSwaps(bytes32 _swapID) {
        require(swapStates[_swapID] == States.INVALID);
        _;
    }

    modifier onlyOpenSwaps(bytes32 _swapID) {
        require(swapStates[_swapID] == States.OPEN);
        _;
    }

    modifier onlyClosedSwaps(bytes32 _swapID) {
        require(swapStates[_swapID] == States.CLOSED);
        _;
    }

    modifier onlyExpirableSwaps(bytes32 _swapID) {
        require(block.timestamp >= swaps[_swapID].timelock);
        _;
    }

    modifier onlyWithSecretKey(bytes32 _swapID, bytes memory _secretKey) {
        // TODO: Inject Schnorr verification;
        // Note: _swapID is actually the commitment
        require(_swapID == sha256(_secretKey));
        _;
    }

    function openETH(
        bytes32 _swapID,
        address payable _recipient,
        uint256 _timelock
    ) public payable {
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
            secretKey: new bytes(0)
        });
        swaps[_swapID] = swap;
        swapStates[_swapID] = States.OPEN;

        emit Open(_swapID, _recipient);
    }

    function openERC20(
        bytes32 _swapID,
        address payable _recipient,
        uint256 _timelock,
        address _tokenAddress,
        uint256 _value
    ) public payable {
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
            secretKey: new bytes(0)
        });
        swaps[_swapID] = swap;
        swapStates[_swapID] = States.OPEN;

        emit Open(_swapID, _recipient);
    }

    function close(
        bytes32 _swapID,
        bytes memory _secretKey
    ) public onlyOpenSwaps(_swapID) onlyWithSecretKey(_swapID, _secretKey) {
        Swap memory swap = swaps[_swapID];
        swaps[_swapID].secretKey = _secretKey;
        swapStates[_swapID] = States.CLOSED;

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
        bytes32 _swapID
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
        bytes32 _swapID
    ) public view onlyClosedSwaps(_swapID) returns (bytes memory secretKey) {
        Swap memory swap = swaps[_swapID];
        return swap.secretKey;
    }
}
