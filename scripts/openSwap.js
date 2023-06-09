const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ECCUtils = await ethers.getContractFactory("ECCUtils");
    const eccUtils = await ECCUtils.deploy();

    const AtomicCloak = await ethers.getContractFactory("AtomicCloak", {
        libraries: { ECCUtils: eccUtils.address },
    });
    const atomicCloak = await AtomicCloak.attach(
        process.env.CONTRACT_ADDRESS_SEPOLIA
    );
    secret = ethers.utils.randomBytes(32);
    console.log("Secret: ", secret);
    const [qx, qy] = await atomicCloak.commitmentFromSecret(secret);
    console.log("qx:", qx);
    console.log("qy:", qy);
    const recipient = "0xBDd182877dEc564d96c4A6e21920F237487d01aD";

    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;

    const trs = await atomicCloak.openETH(
        qx,
        qy,
        recipient,
        timestampBefore + 100,
        {
            value: 100,
        }
    );
    console.log(await trs.wait());
    console.log("Transaction hash: ", trs.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
