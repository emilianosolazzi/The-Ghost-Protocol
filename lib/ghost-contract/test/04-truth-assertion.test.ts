import { expect } from "chai";
import { ethers } from "hardhat";
import { deployFixtures, TEST_CONSTANTS, generateProofHash } from "./fixtures/common";

describe("GhostProtocol: Truth Assertion & Resolution", function () {
  describe("assertTruth", function () {
    it("should allow user to assert truth with stake", async function () {
      const { ghostProtocol, ghostedToken, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(701);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      const userBalanceBefore = await ghostedToken.balanceOf(user2.address);

      const tx = ghostProtocol.connect(user2).assertTruth(proofHash, true);

      await expect(tx)
        .to.emit(ghostProtocol, "TruthAsserted")
        .withArgs(user2.address, proofHash, 0, true); // assertion index 0

      // User's staked tokens should be deducted
      const userBalanceAfter = await ghostedToken.balanceOf(user2.address);
      expect(userBalanceBefore - userBalanceAfter).to.equal(
        TEST_CONSTANTS.TRUTH_ASSERTION_STAKE
      );
    });

    it("should store assertion with correct belief", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(702);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);
      await ghostProtocol.connect(user1).assertTruth(proofHash, false);

      const assertion0 = await ghostProtocol.getTruthAssertion(proofHash, 0);
      expect(assertion0.asserter).to.equal(user2.address);
      expect(assertion0.belief).to.equal(true);

      const assertion1 = await ghostProtocol.getTruthAssertion(proofHash, 1);
      expect(assertion1.asserter).to.equal(user1.address);
      expect(assertion1.belief).to.equal(false);
    });

    it("should allow multiple assertions for same evidence", async function () {
      const { ghostProtocol, user1, user2, user3 } = await deployFixtures();

      const proofHash = generateProofHash(703);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await ghostProtocol.connect(user1).assertTruth(proofHash, true);
      await ghostProtocol.connect(user2).assertTruth(proofHash, true);
      await ghostProtocol.connect(user3).assertTruth(proofHash, false);

      const count = await ghostProtocol.getTruthAssertionCount(proofHash);
      expect(count).to.equal(3n);
    });

    it("should reject assertion on non-existent evidence", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol.connect(user1).assertTruth(generateProofHash(999), true)
      ).to.be.revertedWithCustomError(ghostProtocol, "EvidenceNotFound");
    });

    it("should reject assertion when paused", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(704);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await ghostProtocol.setPaused(true);

      await expect(
        ghostProtocol.connect(user2).assertTruth(proofHash, true)
      ).to.be.revertedWithCustomError(ghostProtocol, "ProtocolPaused");
    });
  });

  describe("resolveTruth", function () {
    it("should allow oracle to resolve truth", async function () {
      const { ghostProtocol, oracle, user1, user2, user3 } =
        await deployFixtures();

      const proofHash = generateProofHash(801);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);
      await ghostProtocol.connect(user3).assertTruth(proofHash, false);

      const tx = ghostProtocol.connect(oracle).resolveTruth(proofHash, true);

      await expect(tx)
        .to.emit(ghostProtocol, "TruthResolved")
        .withArgs(proofHash, true);
    });

    it("should reward correct assertions", async function () {
      const { ghostProtocol, ghostedToken, oracle, user1, user2, user3 } =
        await deployFixtures();

      const proofHash = generateProofHash(802);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);
      await ghostProtocol.connect(user3).assertTruth(proofHash, false);

      const balanceBefore2 = await ghostedToken.balanceOf(user2.address);

      // Resolve truth to true (user2 is correct)
      await ghostProtocol.connect(oracle).resolveTruth(proofHash, true);

      const balanceAfter2 = await ghostedToken.balanceOf(user2.address);

      // User2 should receive reward minus stake (already paid)
      // Reward = 200 GHOSTED, Stake = 100 GHOSTED
      // Net = +100 GHOSTED (200 - 100)
      expect(balanceAfter2 - balanceBefore2).to.be.greaterThan(0n);
    });

    it("should burn stake for incorrect assertions", async function () {
      const { ghostProtocol, ghostedToken, oracle, user1, user2, user3 } =
        await deployFixtures();

      const proofHash = generateProofHash(803);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);
      await ghostProtocol.connect(user3).assertTruth(proofHash, false);

      const balanceBefore3 = await ghostedToken.balanceOf(user3.address);

      // Resolve truth to true (user3 is incorrect)
      await ghostProtocol.connect(oracle).resolveTruth(proofHash, true);

      const balanceAfter3 = await ghostedToken.balanceOf(user3.address);

      // User3 loses stake
      expect(balanceBefore3 - balanceAfter3).to.be.greaterThan(0n);
    });

    it("should reject if not oracle", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(804);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);

      await expect(
        ghostProtocol.connect(user2).resolveTruth(proofHash, true)
      ).to.be.revertedWithCustomError(ghostProtocol, "OnlyOracle");
    });

    it("should reject if evidence not found", async function () {
      const { ghostProtocol, oracle } = await deployFixtures();

      await expect(
        ghostProtocol.connect(oracle).resolveTruth(generateProofHash(999), true)
      ).to.be.revertedWithCustomError(ghostProtocol, "EvidenceNotFound");
    });

    it("should reject if already resolved", async function () {
      const { ghostProtocol, oracle, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(805);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);

      // First resolution succeeds
      await ghostProtocol.connect(oracle).resolveTruth(proofHash, true);

      // Second resolution fails
      await expect(
        ghostProtocol.connect(oracle).resolveTruth(proofHash, true)
      ).to.be.revertedWithCustomError(ghostProtocol, "AlreadyResolved");
    });
  });

  describe("Truth Stats & Streaks", function () {
    it("should track truth assertion count", async function () {
      const { ghostProtocol, user1, user2, user3 } = await deployFixtures();

      const proofHash = generateProofHash(901);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      let count = await ghostProtocol.getTruthAssertionCount(proofHash);
      expect(count).to.equal(0n);

      await ghostProtocol.connect(user1).assertTruth(proofHash, true);
      count = await ghostProtocol.getTruthAssertionCount(proofHash);
      expect(count).to.equal(1n);

      await ghostProtocol.connect(user2).assertTruth(proofHash, false);
      count = await ghostProtocol.getTruthAssertionCount(proofHash);
      expect(count).to.equal(2n);

      await ghostProtocol.connect(user3).assertTruth(proofHash, true);
      count = await ghostProtocol.getTruthAssertionCount(proofHash);
      expect(count).to.equal(3n);
    });

    it("should track truth win streak", async function () {
      const { ghostProtocol, oracle, user1, user2 } = await deployFixtures();

      const proofHash1 = generateProofHash(1001);
      const proofHash2 = generateProofHash(1002);

      // First evidence
      await ghostProtocol.connect(user1).submitEvidence(
        proofHash1,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );
      await ghostProtocol.connect(user2).assertTruth(proofHash1, true);

      // User2 wins
      await ghostProtocol.connect(oracle).resolveTruth(proofHash1, true);

      const streak1 = await ghostProtocol.truthWinStreak(user2.address);
      expect(streak1).to.equal(1n);

      // Second evidence
      await ghostProtocol.connect(user1).submitEvidence(
        proofHash2,
        40n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );
      await ghostProtocol.connect(user2).assertTruth(proofHash2, true);

      // User2 wins again
      await ghostProtocol.connect(oracle).resolveTruth(proofHash2, true);

      const streak2 = await ghostProtocol.truthWinStreak(user2.address);
      expect(streak2).to.equal(2n);
    });

    it("should reset streak on incorrect assertion", async function () {
      const { ghostProtocol, oracle, user1, user2 } = await deployFixtures();

      const proofHash1 = generateProofHash(1003);
      const proofHash2 = generateProofHash(1004);

      // First evidence - user2 wins
      await ghostProtocol.connect(user1).submitEvidence(
        proofHash1,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );
      await ghostProtocol.connect(user2).assertTruth(proofHash1, true);
      await ghostProtocol.connect(oracle).resolveTruth(proofHash1, true);

      let streak = await ghostProtocol.truthWinStreak(user2.address);
      expect(streak).to.equal(1n);

      // Second evidence - user2 loses
      await ghostProtocol.connect(user1).submitEvidence(
        proofHash2,
        40n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );
      await ghostProtocol.connect(user2).assertTruth(proofHash2, true);
      await ghostProtocol.connect(oracle).resolveTruth(proofHash2, false);

      streak = await ghostProtocol.truthWinStreak(user2.address);
      expect(streak).to.equal(0n);
    });

    it("should track total truth wins", async function () {
      const { ghostProtocol, oracle, user1, user2 } = await deployFixtures();

      const proofHash1 = generateProofHash(1005);
      const proofHash2 = generateProofHash(1006);

      // First evidence
      await ghostProtocol.connect(user1).submitEvidence(
        proofHash1,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );
      await ghostProtocol.connect(user2).assertTruth(proofHash1, true);
      await ghostProtocol.connect(oracle).resolveTruth(proofHash1, true);

      let totalWins = await ghostProtocol.totalTruthWins(user2.address);
      expect(totalWins).to.equal(1n);

      // Second evidence
      await ghostProtocol.connect(user1).submitEvidence(
        proofHash2,
        40n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );
      await ghostProtocol.connect(user2).assertTruth(proofHash2, true);
      await ghostProtocol.connect(oracle).resolveTruth(proofHash2, true);

      totalWins = await ghostProtocol.totalTruthWins(user2.address);
      expect(totalWins).to.equal(2n);
    });
  });
});
