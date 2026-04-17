import { expect } from "chai";
import { ethers } from "hardhat";
import {
  deployFixtures,
  TEST_CONSTANTS,
  generateProofHash,
} from "./fixtures/common";

describe("GhostProtocol: Truth Assertion & Resolution", function () {
  const RECEIPT_FEE = TEST_CONSTANTS.RECEIPT_FEE;

  async function submitAndPrepare(ghostProtocol: any, submitter: any, seed: number) {
    const proofHash = generateProofHash(seed);
    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 50, "truth test desc", "crypto", "", false, {
        value: RECEIPT_FEE,
      });
    return proofHash;
  }

  describe("assertTruth", function () {
    it("should allow user to assert truth", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 1000);

      const tx = ghostProtocol.connect(user2).assertTruth(proofHash, true);

      await expect(tx)
        .to.emit(ghostProtocol, "TruthAsserted")
        .withArgs(
          proofHash,
          user2.address,
          true,
          TEST_CONSTANTS.TRUTH_ASSERTION_STAKE
        );
    });

    it("should store assertion correctly", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 1001);

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);

      const assertion = await ghostProtocol.getTruthAssertion(proofHash, 0);
      expect(assertion.assertionProofHash).to.equal(proofHash);
      expect(assertion.assertor).to.equal(user2.address);
      expect(assertion.believesReal).to.equal(true);
      expect(assertion.stakeAmount).to.equal(
        TEST_CONSTANTS.TRUTH_ASSERTION_STAKE
      );
      expect(assertion.timestamp).to.be.gt(0n);
      expect(assertion.resolved).to.equal(false);
      expect(assertion.wasCorrect).to.equal(false);
    });

    it("should deduct stake tokens from assertor", async function () {
      const { ghostProtocol, ghostedToken, user1, user2 } =
        await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 1002);

      const balBefore = await ghostedToken.balanceOf(user2.address);
      await ghostProtocol.connect(user2).assertTruth(proofHash, true);
      const balAfter = await ghostedToken.balanceOf(user2.address);

      expect(balBefore - balAfter).to.equal(
        TEST_CONSTANTS.TRUTH_ASSERTION_STAKE
      );
    });

    it("should allow multiple assertions on same proof", async function () {
      const { ghostProtocol, user1, user2, user3 } = await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 1003);

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);
      await ghostProtocol.connect(user3).assertTruth(proofHash, false);

      const count = await ghostProtocol.getTruthAssertionCount(proofHash);
      expect(count).to.equal(2n);
    });

    it("should revert with StoryDoesNotExist for unknown proof", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol
          .connect(user1)
          .assertTruth(generateProofHash(9999), true)
      ).to.be.revertedWithCustomError(ghostProtocol, "StoryDoesNotExist");
    });

    it("should revert with ContractPaused when paused", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 1004);

      await ghostProtocol.setPaused(true);

      await expect(
        ghostProtocol.connect(user2).assertTruth(proofHash, true)
      ).to.be.revertedWithCustomError(ghostProtocol, "ContractPaused");
    });
  });

  describe("resolveTruth", function () {
    it("should resolve correct assertion and reward", async function () {
      const { ghostProtocol, ghostedToken, user1, user2, oracle } =
        await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 2000);

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);

      const balBefore = await ghostedToken.balanceOf(user2.address);

      const tx = ghostProtocol
        .connect(oracle)
        .resolveTruth(proofHash, 0, true);

      await expect(tx)
        .to.emit(ghostProtocol, "TruthResolved")
        .withArgs(
          proofHash,
          user2.address,
          true,
          TEST_CONSTANTS.TRUTH_WIN_REWARD
        );

      const balAfter = await ghostedToken.balanceOf(user2.address);
      expect(balAfter - balBefore).to.equal(TEST_CONSTANTS.TRUTH_WIN_REWARD);
    });

    it("should update assertion as resolved + correct", async function () {
      const { ghostProtocol, user1, user2, oracle } = await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 2001);

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);
      await ghostProtocol.connect(oracle).resolveTruth(proofHash, 0, true);

      const assertion = await ghostProtocol.getTruthAssertion(proofHash, 0);
      expect(assertion.resolved).to.equal(true);
      expect(assertion.wasCorrect).to.equal(true);
    });

    it("should resolve incorrect assertion (burn + submitter share)", async function () {
      const { ghostProtocol, ghostedToken, user1, user2, oracle } =
        await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 2002);

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);

      const submitterBalBefore = await ghostedToken.balanceOf(user1.address);

      const tx = ghostProtocol
        .connect(oracle)
        .resolveTruth(proofHash, 0, false);

      await expect(tx)
        .to.emit(ghostProtocol, "TruthResolved")
        .withArgs(proofHash, user2.address, false, 0);

      // Submitter gets half the stake
      const submitterBalAfter = await ghostedToken.balanceOf(user1.address);
      const halfStake = TEST_CONSTANTS.TRUTH_ASSERTION_STAKE / 2n;
      expect(submitterBalAfter - submitterBalBefore).to.equal(halfStake);
    });

    it("should update win streak on correct resolution", async function () {
      const { ghostProtocol, user1, user2, oracle } = await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 2003);

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);
      await ghostProtocol.connect(oracle).resolveTruth(proofHash, 0, true);

      expect(await ghostProtocol.truthWinStreak(user2.address)).to.equal(1n);
      expect(await ghostProtocol.totalTruthWins(user2.address)).to.equal(1n);
    });

    it("should reset win streak on incorrect resolution", async function () {
      const { ghostProtocol, user1, user2, oracle } = await deployFixtures();

      // Win once first
      const ph1 = await submitAndPrepare(ghostProtocol, user1, 2004);
      await ghostProtocol.connect(user2).assertTruth(ph1, true);
      await ghostProtocol.connect(oracle).resolveTruth(ph1, 0, true);

      expect(await ghostProtocol.truthWinStreak(user2.address)).to.equal(1n);

      // Now lose
      const ph2 = await submitAndPrepare(ghostProtocol, user1, 2005);
      await ghostProtocol.connect(user2).assertTruth(ph2, true);
      await ghostProtocol.connect(oracle).resolveTruth(ph2, 0, false);

      expect(await ghostProtocol.truthWinStreak(user2.address)).to.equal(0n);
    });

    it("should increase protocol credibility on correct assertion", async function () {
      const { ghostProtocol, user1, user2, oracle } = await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 2006);

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);

      const tx = ghostProtocol
        .connect(oracle)
        .resolveTruth(proofHash, 0, true);

      await expect(tx)
        .to.emit(ghostProtocol, "ProtocolCredibilityUpdated")
        .withArgs(
          user2.address,
          0,
          ethers.parseEther("100"),
          "TRUTH_WIN"
        );
    });

    it("should revert with NotOracle for non-oracle caller", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 2010);

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);

      await expect(
        ghostProtocol.connect(user1).resolveTruth(proofHash, 0, true)
      ).to.be.revertedWithCustomError(ghostProtocol, "NotOracle");
    });

    it("should revert with AlreadyResolved on double resolve", async function () {
      const { ghostProtocol, user1, user2, oracle } = await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 2011);

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);
      await ghostProtocol.connect(oracle).resolveTruth(proofHash, 0, true);

      await expect(
        ghostProtocol.connect(oracle).resolveTruth(proofHash, 0, true)
      ).to.be.revertedWithCustomError(ghostProtocol, "AlreadyResolved");
    });

    it("should revert with InvalidAssertionIndex for bad index", async function () {
      const { ghostProtocol, user1, user2, oracle } = await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 2012);

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);

      await expect(
        ghostProtocol.connect(oracle).resolveTruth(proofHash, 5, true)
      ).to.be.revertedWithCustomError(
        ghostProtocol,
        "InvalidAssertionIndex"
      );
    });

    it("should revert with ContractPaused when paused", async function () {
      const { ghostProtocol, user1, user2, oracle } = await deployFixtures();
      const proofHash = await submitAndPrepare(ghostProtocol, user1, 2013);

      await ghostProtocol.connect(user2).assertTruth(proofHash, true);
      await ghostProtocol.setPaused(true);

      await expect(
        ghostProtocol.connect(oracle).resolveTruth(proofHash, 0, true)
      ).to.be.revertedWithCustomError(ghostProtocol, "ContractPaused");
    });
  });
});
