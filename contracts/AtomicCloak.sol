// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ECCUtils.sol";

contract AtomicCloak {
    struct Swap {
        uint256 timelock;
        address tokenContract;
        uint256 value;
        address payable sender;
        address payable recipient;
        Fees fee;
    }

    enum Fees {
        NONE,
        QUICK,
        NORMAL
    }

    address private _closerAccount;
    address public owner;

    mapping(address => Swap) private swaps;
    address immutable ETH_TOKEN_CONTRACT = address(0x0);

    uint256 public immutable gx =
        0xa6ecb3f599964fe04c72e486a8f90172493c21f4185f1ab9a7fe05659480c548;
    uint256 public immutable gy =
        0xdf67fd3f4255826c234a5262adc70e14a6d42f13ee55b65e885e666e1dd5d3f5;
    uint8 public immutable gyParity = 28; //== gy 27 if gy is even else 28
    uint256 public immutable curveOrder =
        0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;

    event Open(
        address indexed _swapID,
        address indexed _sender,
        address indexed _recipient
    );
    event Close(address indexed _swapID, uint256 indexed _secretKey);
    event Expire(address indexed _swapID);

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner can call.");
        _;
    }

    modifier onlyFromCloserAccount() {
        require(msg.sender == _closerAccount, "Only Closer Wallet can call.");
        _;
    }

    modifier onlyInvalidSwaps(address _swapID) {
        require(swaps[_swapID].value == 0, "Swap has been already opened.");
        _;
    }

    modifier onlyOpenSwaps(address _swapID) {
        require(swaps[_swapID].value > 0, "Swap has not been opened.");
        require(swaps[_swapID].timelock < block.timestamp, "Swap has expired.");
        _;
    }

    modifier onlyExpirableSwaps(address _swapID) {
        require(
            block.timestamp >= swaps[_swapID].timelock,
            "Swap has not expired."
        );
        _;
    }

    modifier onlyWithSecretKey(address _swapID, uint256 _secretKey) {
        // require(_swapID == sha256(_secretKey)); This is the usual HTLC way.
        // Instead we use Schnorr-ish verification;
        // Note: _swapID is actually the hashed commitment
        require(
            verifyHashedCommitment(_secretKey, _swapID),
            "Verification failed."
        );

        _;
    }

    function setCloserAccount(address _newCloserAccount) external onlyOwner {
        require(_closerAccount == address(0), "Closer Account already set.");
        _closerAccount = _newCloserAccount;
        owner = address(0);
    }

    /// @param _secretKey is the secret scalar that generated the commitment.
    function verifyHashedCommitment(
        uint256 _secretKey,
        address _swapID
    ) public pure returns (bool) {
        return getHashedCommitment(_secretKey) == _swapID;
    }

    function verifyCloserOp(
        uint256 _secretKey,
        address _swapID
    ) public view onlyFromCloserAccount returns (bool) {
        Swap memory swap = swaps[_swapID];
        require(
            swap.tokenContract == ETH_TOKEN_CONTRACT,
            "Only ETH swaps can be closed using Closer Wallet"
        );
        return getHashedCommitment(_secretKey) == _swapID;
    }

    function commitmentFromSecret(
        uint256 _secretKey
    ) public pure returns (uint256, uint256) {
        return ECCUtils.ecmul(gx, gy, _secretKey);
    }

    function getHashedCommitment(
        uint256 _secretKey
    ) public pure returns (address) {
        address signer = ecrecover(
            0,
            gyParity,
            bytes32(gx),
            bytes32(mulmod(_secretKey, gx, curveOrder))
        );

        return signer;
    }

    function commitmentToAddress(
        uint256 _qx,
        uint256 _qy
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
        uint256 _qx,
        uint256 _qy,
        address payable _recipient,
        uint256 _timelock
    ) public payable {
        // The swapID is used also as commitment
        address _swapID = commitmentToAddress(_qx, _qy);

        require(swaps[_swapID].value == 0, "Swap has been already opened.");
        require(
            _timelock > block.timestamp,
            "Timelock value must be in the future."
        );
        require(msg.value > 0, "Value must be larger than 0.");

        Swap memory swap = Swap({
            timelock: _timelock,
            tokenContract: ETH_TOKEN_CONTRACT,
            value: msg.value,
            sender: payable(msg.sender),
            recipient: _recipient,
            fee: Fees.NONE
        });

        swaps[_swapID] = swap;

        emit Open(_swapID, msg.sender, _recipient);
    }

    function openERC20(
        uint256 _qx,
        uint256 _qy,
        address payable _recipient,
        uint256 _timelock,
        address _tokenAddress,
        uint256 _value
    ) public payable {
        address _swapID = commitmentToAddress(_qx, _qy);
        // The swapID is used also as commitment
        require(swaps[_swapID].value == 0, "Swap has been already opened.");
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

        require(_value > 0, "Value must be larger than 0.");

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
            value: _value,
            sender: payable(msg.sender),
            recipient: _recipient,
            fee: Fees.NONE
        });
        swaps[_swapID] = swap;

        emit Open(_swapID, msg.sender, _recipient);
    }

    // This function closes the swap without verifying the secret key.
    // THis is done to save on gas. Only the closer wallet can call this.
    // The closer wallet verifies the secret key before calling this function.
    // Since the closer wallet can not be updated more than once, users can be sure that the
    // provider does not update the closer wallet to a one that skips the verification.
    function closeNoVerify(
        address _swapID,
        uint256 _secretKey
    ) public onlyOpenSwaps(_swapID) onlyFromCloserAccount {
        Swap memory swap = swaps[_swapID];
        // Note: we already verified that swap.tokenAddress == ETH_TOKEN_ADDRESS.
        // TODO: implement fees to incentivize closing contracts as fast as possible.
        // Transfer the ETH funds from this contract to the recipient.
        swap.recipient.transfer(swap.value);

        // TODO: send part of the swap value back to closer wallet, since closer wallet paid for the gas.

        emit Close(_swapID, _secretKey);
        delete swaps[_swapID];
    }

    function close(
        address _swapID,
        uint256 _secretKey
    ) public onlyOpenSwaps(_swapID) onlyWithSecretKey(_swapID, _secretKey) {
        Swap memory swap = swaps[_swapID];

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
        delete swaps[_swapID];
    }

    function redeemExpiredSwap(
        address _swapID
    ) public onlyOpenSwaps(_swapID) onlyExpirableSwaps(_swapID) {
        Swap memory swap = swaps[_swapID];

        if (swap.tokenContract == ETH_TOKEN_CONTRACT) {
            // Transfer the ETH funds from this contract to the sender.
            swap.sender.transfer(swap.value);
        } else {
            // Transfer the ERC20 funds from this contract to the sender.
            ERC20 erc20Contract = ERC20(swap.tokenContract);
            require(erc20Contract.transfer(swap.sender, swap.value));
        }

        emit Expire(_swapID);
        delete swaps[_swapID];
    }
}
