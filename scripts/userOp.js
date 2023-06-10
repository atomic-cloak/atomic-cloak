const hre = require("hardhat");

async function main() {
    const ECCUtils = await ethers.getContractFactory("ECCUtils");
    const eccUtils = await ECCUtils.deploy();

    const AtomicCloak = await ethers.getContractFactory("AtomicCloak", {
        libraries: { ECCUtils: eccUtils.address },
    });
    const atomicCloak = await AtomicCloak.attach(
        process.env.ATOMIC_CLOAK_ADDRESS_MUMBAI
    );

    const secret = ethers.utils.randomBytes(32);
    const [qx, qy] = await atomicCloak.commitmentFromSecret(secret);
    console.log("Secret: ", Buffer.from(secret).toString("hex"));

    const hashedCommitment = await atomicCloak.commitmentToAddress(qx, qy);

    const payload = {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_sendUserOperation",
        params: [
            {
                sender: process.env.ATOMIC_CLOAK_ADDRESS_MUMBAI,
                nonce: "0x0",
                initCode: "0x",
                callData:
                    "0x685da727" +
                    "000000000000000000000000" +
                    hashedCommitment.slice(2) +
                    Buffer.from(secret).toString("hex"),
                callGasLimit: "0x214C10",
                verificationGasLimit: "0x06E360",
                preVerificationGas: "0x06E360",
                maxFeePerGas: "0x20",
                maxPriorityFeePerGas: "0x0",
                paymasterAndData: "0x",
                signature: "0x",
            },
            "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        ],
    };

    console.log(payload);
    const response = await fetch(
        "https://api.stackup.sh/v1/node/fde21eaf3765d1c5fa8bc4ba7b42854beb1b3c0775b2d697286932fbcf3dde1d",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify(payload),
        }
    );
    console.log(await response.json());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
