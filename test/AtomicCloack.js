const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AtomicCloak", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployAtomicCloak() {
        // Contracts are deployed using the first signer/account by default
        const [owner] = await ethers.getSigners();

        const ECCUtils = await ethers.getContractFactory("ECCUtils");
        const eccUtils = await ECCUtils.deploy();

        const AtomicCloak = await ethers.getContractFactory("AtomicCloak", {
            libraries: { ECCUtils: eccUtils.address },
        });
        const atomicCloak = await AtomicCloak.deploy();

        return { atomicCloak, owner };
    }

    describe("Deployment", function () {});

    describe("Commitments", function () {
        it("Should create commitment from secret", async function () {
            const { atomicCloak } = await loadFixture(deployAtomicCloak);
            secret =
                "0x1787f38d854231dfec2b27a0f621414d10bfa95970b3e576aed29e1e8287e51e";

            const [qx, qy] = await atomicCloak.commitmentFromSecret(secret);
            expect(qx.toHexString()).to.equal(
                "0xaddcb45773b26a2f8ac2143627d54f47a12aab533dc1b41b4e791985e9eca496"
            );
            expect(qy.toHexString()).to.equal(
                "0x72da5adb3a30a2cf147d309b0cf58c76b322c82a5edae164e13dbeed6429c41d"
            );
        });

        it("Should verify commitment", async function () {
            const { atomicCloak } = await loadFixture(deployAtomicCloak);

            const qx =
                "0xaddcb45773b26a2f8ac2143627d54f47a12aab533dc1b41b4e791985e9eca496";
            const qy =
                "0x72da5adb3a30a2cf147d309b0cf58c76b322c82a5edae164e13dbeed6429c41d";

            const hashedCommitment = await atomicCloak.commitmentToAddress(
                qx,
                qy
            );
            secret =
                "0x1787f38d854231dfec2b27a0f621414d10bfa95970b3e576aed29e1e8287e51e";

            expect(
                await atomicCloak.verifyHashedCommitment(
                    secret,
                    hashedCommitment
                )
            ).to.equal(true);
        });

        it("Should generate and verify random commitment", async function () {
            const { atomicCloak } = await loadFixture(deployAtomicCloak);

            const secret = ethers.utils.randomBytes(32);
            const [qx, qy] = await atomicCloak.commitmentFromSecret(secret);
            const hashedCommitment = await atomicCloak.commitmentToAddress(
                qx,
                qy
            );
            console.log("Secret:", secret);
            console.log(
                "Commitment: (",
                qx.toHexString(),
                ", ",
                qy.toHexString(),
                ")"
            );
            console.log("Hashed commitment:", hashedCommitment);
            expect(
                await atomicCloak.verifyHashedCommitment(
                    secret,
                    hashedCommitment
                )
            ).to.equal(true);
        });
    });

    describe("Events", function () {
        // it("Should emit an event on withdrawals", async function () {
        //     const { lock, unlockTime, lockedAmount } = await loadFixture(
        //         deployOneYearLockFixture
        //     );
        //     await time.increaseTo(unlockTime);
        //     await expect(lock.withdraw())
        //         .to.emit(lock, "Withdrawal")
        //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
        // });
    });
});
