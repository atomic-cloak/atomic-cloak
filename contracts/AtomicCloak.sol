// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@account-abstraction/contracts/core/BaseAccount.sol";
import "./ECCUtils.sol";

contract AtomicCloak is BaseAccount {
    struct Swap {
        uint256 timelock;
        address tokenContract;
        uint256 value;
        address payable sender;
        address payable recipient;
        uint256 fee;
    }

    uint256 constant NO_FEE = 0;
    // uint256 constant TIMED_FEE = 0.00001 ether;
    uint256 constant SMALL_FEE = 0.001 ether;
    uint256 constant LARGE_FEE = 0.01 ether;

    uint256 constant SMALL_VALUE = 0.1 ether;
    uint256 constant MEDIUM_VALUE = 1 ether;
    uint256 constant LARGE_VALUE = 10 ether;

    IEntryPoint private immutable _entryPoint;

    mapping(address => Swap) public swaps;
    address immutable ETH_TOKEN_CONTRACT = address(0x0);
    bytes4 immutable CLOSE_NO_VERIFY_SELECTOR = 0x685da727;
    // == bytes4(keccak256("closeNoVerify(address,uint256)"));

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

    /// @inheritdoc BaseAccount
    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }

    constructor(address __entryPoint) {
        _entryPoint = IEntryPoint(__entryPoint);
    }

    function commitmentFromSecret(
        uint256 _secretKey
    ) public pure returns (uint256, uint256) {
        return ECCUtils.ecmul(gx, gy, _secretKey);
    }

    function commitmentFromSharedSecret(
        uint256 _qx,
        uint256 _qy,
        uint256 _sharedSecret
    ) public pure returns (uint256, uint256) {
        (uint256 _qsx, uint256 _qsy) = commitmentFromSecret(_sharedSecret);
        return ECCUtils.ecadd(_qx, _qy, _qsx, _qsy);
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
        require(
            msg.value == SMALL_VALUE ||
                msg.value == MEDIUM_VALUE ||
                msg.value == LARGE_VALUE,
            "Invalid message value."
        );

        Swap memory swap = Swap({
            timelock: _timelock,
            tokenContract: ETH_TOKEN_CONTRACT,
            value: msg.value,
            sender: payable(msg.sender),
            recipient: _recipient,
            fee: NO_FEE
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
            fee: NO_FEE
        });
        swaps[_swapID] = swap;

        emit Open(_swapID, msg.sender, _recipient);
    }

    function close(address _swapID, uint256 _secretKey) public payable {
        require(swaps[_swapID].value > 0, "Swap has not been opened.");
        require(swaps[_swapID].timelock > block.timestamp, "Swap has expired.");

        // require(_swapID == sha256(_secretKey)); This is the usual HTLC way.
        // Instead we use Schnorr-ish verification;
        // Note: _swapID is actually the hashed commitment
        require(
            getHashedCommitment(_secretKey) == _swapID,
            "Verification failed."
        );

        Swap memory swap = swaps[_swapID];

        // TODO: implement fees to incentivize closing contracts as fast as possible.
        if (swap.tokenContract == ETH_TOKEN_CONTRACT) {
            // Transfer the ETH funds from this contract to the recipient.
            swap.recipient.transfer(swap.value - swap.fee);
            if (swap.fee > 0) {
                // Transfer the fee to the provider.
                swap.sender.transfer(swap.fee);
            }
        } else {
            require(msg.value >= swap.fee, "Insufficient fee.");
            // Transfer the ERC20 funds from this contract to the recipient.
            ERC20 erc20Contract = ERC20(swap.tokenContract);
            require(erc20Contract.transfer(swap.recipient, swap.value));
            if (msg.value > 0) {
                // Transfer the fee to the provider.
                swap.sender.transfer(msg.value);
            }
        }

        emit Close(_swapID, _secretKey);
        delete swaps[_swapID];
    }

    function redeemExpiredSwap(address _swapID) public {
        require(swaps[_swapID].value > 0, "Swap has not been opened.");
        require(
            swaps[_swapID].timelock <= block.timestamp,
            "Swap has not expired."
        );

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

    function closeNoVerify(address _swapID, uint256 _secretKey) public {
        _requireFromEntryPoint();
        Swap memory swap = swaps[_swapID];
        // Note: we already verified that swap.tokenAddress == ETH_TOKEN_ADDRESS.
        // TODO: implement fees to incentivize closing contracts as fast as possible.
        // Transfer the ETH funds from this contract to the recipient.
        swap.recipient.transfer(swap.value);

        // TODO: send part of the swap value back to closer wallet, since closer wallet paid for the gas.

        emit Close(_swapID, _secretKey);
        delete swaps[_swapID];
    }

    /// implement template method of BaseAccount
    //FIXME: set oublic --> internal, this is only for tests
    function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal virtual override returns (uint256 validationData) {
        (bytes4 _selector, address _swapID, uint256 _secretKey) = abi.decode(
            userOp.callData,
            (bytes4, address, uint256)
        );

        if (_selector != CLOSE_NO_VERIFY_SELECTOR) {
            return SIG_VALIDATION_FAILED;
        }

        Swap memory swap = swaps[_swapID];

        if (swaps[_swapID].value == 0) {
            return SIG_VALIDATION_FAILED;
        }

        if (swaps[_swapID].timelock <= block.timestamp) {
            return SIG_VALIDATION_FAILED;
        }

        if (swap.tokenContract != ETH_TOKEN_CONTRACT) {
            return SIG_VALIDATION_FAILED;
        }
        if (getHashedCommitment(_secretKey) != _swapID) {
            return SIG_VALIDATION_FAILED;
        }
        return 0;
    }

    function validateSignature_test(UserOperation calldata userOp) public {
        // (bytes4 _selector, address _swapID, uint256 _secretKey) = abi.decode(
        //     userOp.callData,
        //     (bytes4, address, uint256)
        // );
        bytes4 _selector = bytes4(userOp.callData[:4]);
        address _swapID = address(
            uint160(uint256(bytes32(userOp.callData[4:36])))
        );
        uint256 _secretKey = uint256(bytes32(userOp.callData[36:68]));

        require(_selector == CLOSE_NO_VERIFY_SELECTOR, "Invalid selector.");

        Swap memory swap = swaps[_swapID];

        require(swaps[_swapID].value > 0, "Swap has not been opened.");

        require(swaps[_swapID].timelock > block.timestamp, "Swap has expired.");

        require(
            swap.tokenContract == ETH_TOKEN_CONTRACT,
            "Token contract is not ETH."
        );

        require(
            getHashedCommitment(_secretKey) == _swapID,
            "Verification failed."
        );
    }
}
