const hre = require("hardhat");

async function main() {
    const ECCUtils = await ethers.getContractFactory("ECCUtils");
    const eccUtils = await ECCUtils.deploy();

    const AtomicCloak = await ethers.getContractFactory("AtomicCloak", {
        libraries: { ECCUtils: eccUtils.address },
    });
    const atomicCloak = await AtomicCloak.deploy();
    // await atomicCloak.deployed();

    console.log("AtomicCloak deployed to:", atomicCloak.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
