// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./CloserAccount.sol";

contract CloserAccountFactory {
    // Returns the address of the newly deployed contract
    function deploy(
        uint256 _salt,
        address _entryPoint,
        address _atomicCloak
    ) public payable returns (address) {
        // This syntax is a newer way to invoke create2 without assembly, you just need to pass salt
        // https://docs.soliditylang.org/en/latest/control-structures.html#salted-contract-creations-create2
        return
            address(
                new CloserAccount{salt: bytes32(_salt)}(
                    msg.sender,
                    _entryPoint,
                    _atomicCloak
                )
            );
    }

    // 1. Get bytecode of contract to be deployed
    function getBytecode(
        address _entryPoint,
        address _atomicCloak
    ) public view returns (bytes memory) {
        bytes memory bytecode = type(CloserAccount).creationCode;
        return
            abi.encodePacked(
                bytecode,
                abi.encode(msg.sender, _entryPoint, _atomicCloak)
            );
    }

    /** 2. Compute the address of the contract to be deployed
        params:
            _salt: random unsigned number used to precompute an address
    */
    function getContractAddress(
        uint256 _salt,
        address _entryPoint,
        address _atomicCloak
    ) public view returns (address) {
        // Get a hash concatenating args passed to encodePacked
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff), // 0
                address(this),
                _salt,
                keccak256(getBytecode(_entryPoint, _atomicCloak)) // the wallet contract bytecode
            )
        );
        // Cast last 20 bytes of hash to address
        return address(uint160(uint256(hash)));
    }
}
