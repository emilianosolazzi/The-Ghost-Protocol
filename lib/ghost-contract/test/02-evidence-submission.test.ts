import { expect } from "chai";
import { ethers } from "hardhat";
import { deployFixtures, TEST_CONSTANTS, generateProofHash } from "./fixtures/common";

describe("GhostProtocol: Evidence Submission", function () {
  describe("submitEvidence - Direct Evidence", function () {
    it("should submit direct evidence and mint reward", async function () {
      const { ghostProtocol, ghostedToken, user1, treasury, oracle } =
        await deployFixtures();

      const proofHash = generateProofHash(1);
      const severity = 50n;
      const expectedReward = (severity * 50n); // 50 GHOSTED per severity point

      const tx = ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        severity,
        false, // not proxy
        "test drama type",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await expect(tx)
        .to.emit(ghostProtocol, "EvidenceSubmitted")
        .withArgs(user1.address, proofHash, severity, false, expectedReward);

      // Check token was minted to submitter
      const userBalance = await ghostedToken.balanceOf(user1.address);
      expect(userBalance).to.be.greaterThan(ethers.parseEther("10000")); // received reward

      // Check fee was split
      const stats = await ghostProtocol.getProtocolStats();
      expect(stats.totalDirectEvidenceRewards).to.equal(
        ethers.parseEther("2500") // severity 50 * 50 = 2500
      );
    });

    it("should submit proxy evidence without token mint", async function () {
      const { ghostProtocol, ghostedToken, user1, treasury } =
        await deployFixtures();

      const proofHash = generateProofHash(2);
      const severity = 30n;
      const initialBalance = await ghostedToken.balanceOf(user1.address);

      ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        severity,
        true, // is proxy
        "test drama type",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      // Proxy should not mint reward
      const finalBalance = await ghostedToken.balanceOf(user1.address);
      expect(finalBalance).to.equal(initialBalance);
    });

    it("should split fee correctly between treasury and protocol", async function () {
      const { ghostProtocol, treasury, user1 } = await deployFixtures();

      const initialTreasuryBalance = await ethers.provider.getBalance(
        treasury.address
      );

      ghostProtocol.connect(user1).submitEvidence(
        generateProofHash(3),
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      const finalTreasuryBalance = await ethers.provider.getBalance(
        treasury.address
      );

      // Treasury gets 30%
      const expectedTreasuryShare =
        (TEST_CONSTANTS.RECEIPT_FEE * TEST_CONSTANTS.TREASURY_SPLIT_BPS) /
        TEST_CONSTANTS.BPS_DENOMINATOR;

      expect(finalTreasuryBalance).to.be.greaterThanOrEqual(
        initialTreasuryBalance + (expectedTreasuryShare * 99n) / 100n // allow 1% variance for rounding
      );
    });

    it("should reject severity < 1", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol.connect(user1).submitEvidence(
          generateProofHash(4),
          0, // invalid
          false,
          "test",
          { value: TEST_CONSTANTS.RECEIPT_FEE }
        )
      ).to.be.revertedWithCustomError(ghostProtocol, "InvalidSeverity");
    });

    it("should reject severity > 100", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol.connect(user1).submitEvidence(
          generateProofHash(5),
          101n, // invalid
          false,
          "test",
          { value: TEST_CONSTANTS.RECEIPT_FEE }
        )
      ).to.be.revertedWithCustomError(ghostProtocol, "InvalidSeverity");
    });

    it("should reject proofHash zero", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol.connect(user1).submitEvidence(
          ethers.ZeroHash,
          50n,
          false,
          "test",
          { value: TEST_CONSTANTS.RECEIPT_FEE }
        )
      ).to.be.revertedWithCustomError(ghostProtocol, "InvalidProofHash");
    });

    it("should reject duplicate proofHash", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      const proofHash = generateProofHash(6);

      // First submission succeeds
      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      // Second submission with same proofHash fails
      await expect(
        ghostProtocol.connect(user1).submitEvidence(
          proofHash,
          40n,
          false,
          "test",
          { value: TEST_CONSTANTS.RECEIPT_FEE }
        )
      ).to.be.revertedWithCustomError(ghostProtocol, "EvidenceAlreadyExists");
    });

    it("should reject insufficient ETH fee", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      const insufficientFee = ethers.parseEther("0.001");

      await expect(
        ghostProtocol.connect(user1).submitEvidence(
          generateProofHash(7),
          50n,
          false,
          "test",
          { value: insufficientFee }
        )
      ).to.be.revertedWithCustomError(ghostProtocol, "InsufficientFeeAmount");
    });

    it("should refund overpayment", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      const overpayment = TEST_CONSTANTS.RECEIPT_FEE + ethers.parseEther("1");
      const initialBalance = await ethers.provider.getBalance(user1.address);

      const tx = await ghostProtocol.connect(user1).submitEvidence(
        generateProofHash(8),
        50n,
        false,
        "test",
        { value: overpayment }
      );

      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const finalBalance = await ethers.provider.getBalance(user1.address);

      // User should get back close to the overpayment amount minus gas
      expect(initialBalance - finalBalance).to.be.lessThan(
        TEST_CONSTANTS.RECEIPT_FEE + gasUsed + ethers.parseEther("0.01") // some tolerance
      );
    });

    it("should increment submission counter", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      const statsBefore = await ghostProtocol.getProtocolStats();
      expect(statsBefore.totalEvidenceSubmissions).to.equal(0n);

      await ghostProtocol.connect(user1).submitEvidence(
        generateProofHash(9),
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      const statsAfter = await ghostProtocol.getProtocolStats();
      expect(statsAfter.totalEvidenceSubmissions).to.equal(1n);
    });

    it("should revert when paused", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await ghostProtocol.setPaused(true);

      await expect(
        ghostProtocol.connect(user1).submitEvidence(
          generateProofHash(10),
          50n,
          false,
          "test",
          { value: TEST_CONSTANTS.RECEIPT_FEE }
        )
      ).to.be.revertedWithCustomError(ghostProtocol, "ProtocolPaused");
    });

    it("should store evidence with correct structure", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      const proofHash = generateProofHash(11);
      const severity = 75n;

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        severity,
        false,
        "test drama",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      const evidence = await ghostProtocol.getEvidence(proofHash);
      expect(evidence.submitted).to.equal(true);
      expect(evidence.severity).to.equal(severity);
      expect(evidence.submitter).to.equal(user1.address);
      expect(evidence.isProxy).to.equal(false);
    });
  });

  describe("submitEvidence - Multiple Submissions", function () {
    it("should handle multiple submissions from different users", async function () {
      const { ghostProtocol, user1, user2, user3 } = await deployFixtures();

      for (let i = 0; i < 3; i++) {
        const users = [user1, user2, user3];
        const user = users[i];
        await ghostProtocol.connect(user).submitEvidence(
          generateProofHash(100 + i),
          (50 + i) as any,
          false,
          "test",
          { value: TEST_CONSTANTS.RECEIPT_FEE }
        );
      }

      const stats = await ghostProtocol.getProtocolStats();
      expect(stats.totalEvidenceSubmissions).to.equal(3n);
    });
  });
});
