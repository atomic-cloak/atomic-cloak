const hre = require("hardhat");

async function main() {
    const Factory = await ethers.getContractFactory("SimpleAccountFactory");
    const factory = await Factory.attach(
        process.env.SIMPLE_ACCOUNT_FACTORY_ADDRESS
    );
    const _salt = process.env.PROVIDER_SIMPLE_ACCOUNT_SALT;
    const [owner] = await ethers.getSigners();

    console.log(
        "Computed address: ",
        await factory.getAddress(owner.address, _salt)
    );
    const trs = await factory.createAccount(owner.address, _salt);
    console.log("SimpleAccount deployed to:", await trs.wait());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
