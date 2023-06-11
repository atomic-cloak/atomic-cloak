const hre = require("hardhat");

async function main() {
    const [owner] = await ethers.getSigners();

    const ECCUtils = await ethers.getContractFactory("ECCUtils");
    const eccUtils = await ECCUtils.deploy();
    console.log("ECCUtils deployed to:", eccUtils.address);

    const AtomicCloakFactory = await ethers.getContractFactory(
        "AtomicCloakFactory",
        {
            libraries: { ECCUtils: eccUtils.address },
        }
    );
    const atomicCloakFactory = await AtomicCloakFactory.deploy(
        process.env.ENTRY_POINT_ADDRESS
    );
    await atomicCloakFactory.deployed();
    console.log("atomicCloakFactory deployed to:", atomicCloakFactory.address);

    const cloackDeployTrs = await atomicCloakFactory.deploy(
        process.env.ATOMIC_CLOAK_SALT
    );
    // console.log(await cloackDeployTrs.wait());

    console.log(
        "AtomicCloak deployed to:",
        await atomicCloakFactory.getContractAddress(
            process.env.ATOMIC_CLOAK_SALT
        )
    );

    // const SimpleAccountFactory = await ethers.getContractFactory(
    //     "SimpleAccountFactory"
    // );
    // const simpleAccountFactory = await SimpleAccountFactory.deploy(
    //     process.env.ENTRY_POINT_ADDRESS
    // );
    // await simpleAccountFactory.deployed();
    // console.log(
    //     "simpleAccountFactory deployed to:",
    //     simpleAccountFactory.address
    // );

    // const simpleAccountkDeployTrs = await simpleAccountFactory.createAccount(
    //     owner.address,
    //     process.env.PROVIDER_SIMPLE_ACCOUNT_SALT
    // );
    // // console.log(await simpleAccountkDeployTrs.wait());

    // console.log(
    //     "Simple account deployed to:",
    //     await simpleAccountFactory.getAddress(
    //         owner.address,
    //         process.env.PROVIDER_SIMPLE_ACCOUNT_SALT
    //     )
    // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
