const hre = require("hardhat");

async function main() {
    var abi = ["function closeNoVerify(address,uint256)"];
    var iface = new ethers.utils.Interface(abi);
    var id = iface.getSighash("closeNoVerify");

    const [owner] = await ethers.getSigners();
    console.log("Address", owner.address);

    console.log(id);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
