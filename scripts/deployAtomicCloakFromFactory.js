const hre = require("hardhat");

async function main() {
    const ECCUtils = await ethers.getContractFactory("ECCUtils");
    const eccUtils = await ECCUtils.deploy();

    // const AtomicCloak = await ethers.getContractFactory("AtomicCloak", {
    //     libraries: { ECCUtils: eccUtils.address },
    // });
    // const atomicCloak = await AtomicCloak.deploy();
    const AtomicCloakFactory = await ethers.getContractFactory(
        "AtomicCloakFactory",
        {
            libraries: { ECCUtils: eccUtils.address },
        }
    );
    const factory = await AtomicCloakFactory.deploy();
    const _salt = 42;
    const trs = await factory.deploy(_salt);
    console.log(await trs.wait());

    const addr = await factory.getContractAddress(_salt);
    console.log("AtomicCloak deployed to:", addr);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
