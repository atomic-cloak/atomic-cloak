// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import "./AtomicCloak.sol";

contract AtomicCloakFactory {
    // Returns the address of the newly deployed contract
    function deploy(uint256 _salt) public payable returns (address) {
        // This syntax is a newer way to invoke create2 without assembly, you just need to pass salt
        // https://docs.soliditylang.org/en/latest/control-structures.html#salted-contract-creations-create2
        return address(new AtomicCloak{salt: bytes32(_salt)}(msg.sender));
    }

    // 1. Get bytecode of contract to be deployed
    function getBytecode() public view returns (bytes memory) {
        bytes memory bytecode = type(AtomicCloak).creationCode;
        return abi.encodePacked(bytecode, abi.encode(msg.sender));
    }

    /** 2. Compute the address of the contract to be deployed
        params:
            _salt: random unsigned number used to precompute an address
    */
    function getContractAddress(uint256 _salt) public view returns (address) {
        // Get a hash concatenating args passed to encodePacked
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff), // 0
                address(this), // address of factory contract
                _salt,
                keccak256(getBytecode()) // the wallet contract bytecode
            )
        );
        // Cast last 20 bytes of hash to address
        return address(uint160(uint256(hash)));
    }
}
