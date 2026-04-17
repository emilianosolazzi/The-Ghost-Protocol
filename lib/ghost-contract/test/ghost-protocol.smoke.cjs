const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GhostProtocol smoke", function () {
  async function deployFixture() {
    const [owner, treasury, oracle, pendingOwner, submitter, unlocker] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockERC20");
    const ghostedToken = await MockToken.deploy(
      "GHOSTED",
      "GHOSTED",
      ethers.parseEther("1000000")
    );
    await ghostedToken.waitForDeployment();

    const GhostProtocol = await ethers.getContractFactory("GhostProtocol");
    const ghostProtocol = await GhostProtocol.deploy(
      await ghostedToken.getAddress(),
      treasury.address,
      oracle.address
    );
    await ghostProtocol.waitForDeployment();
    await ghostedToken.setProtocol(await ghostProtocol.getAddress());
    await ghostProtocol.connect(oracle).setUnlockPriceQuote(1_000_000_000_000n);

    await ghostedToken.transfer(await ghostProtocol.getAddress(), ethers.parseEther("250000"));
    await ghostedToken.transfer(unlocker.address, ethers.parseEther("5000"));
    await ghostedToken.connect(unlocker).approve(await ghostProtocol.getAddress(), ethers.MaxUint256);

    return {
      owner,
      treasury,
      oracle,
      pendingOwner,
      submitter,
      unlocker,
      ghostedToken,
      ghostProtocol,
    };
  }

  it("rejects zero addresses in constructor with InvalidAddress", async function () {
    const [, treasury, oracle] = await ethers.getSigners();
    const GhostProtocol = await ethers.getContractFactory("GhostProtocol");

    await expect(
      GhostProtocol.deploy(ethers.ZeroAddress, treasury.address, oracle.address)
    ).to.be.revertedWithCustomError(GhostProtocol, "InvalidAddress");
  });

  it("uses a two-step ownership transfer", async function () {
    const { ghostProtocol, owner, pendingOwner } = await deployFixture();

    await expect(ghostProtocol.connect(owner).transferOwnership(pendingOwner.address))
      .to.emit(ghostProtocol, "OwnershipTransferStarted")
      .withArgs(owner.address, pendingOwner.address);

    expect(await ghostProtocol.owner()).to.equal(owner.address);
    expect(await ghostProtocol.pendingOwner()).to.equal(pendingOwner.address);

    await expect(ghostProtocol.connect(pendingOwner).acceptOwnership())
      .to.emit(ghostProtocol, "OwnershipTransferred")
      .withArgs(owner.address, pendingOwner.address);

    expect(await ghostProtocol.owner()).to.equal(pendingOwner.address);
    expect(await ghostProtocol.pendingOwner()).to.equal(ethers.ZeroAddress);
  });

  it("submits direct evidence and pays the configured reward", async function () {
    const { ghostProtocol, ghostedToken, submitter } = await deployFixture();
    const proofHash = ethers.id("proof-smoke-1");
    const severity = 32n;
    const reward = severity * 50n * 10n ** 18n;

    const beforeBalance = await ghostedToken.balanceOf(submitter.address);

    await expect(
      ghostProtocol
        .connect(submitter)
        .submitEvidence(proofHash, severity, "oh it hurts", "Orbiting", "", false, {
          value: ethers.parseEther("0.0095"),
        })
    )
      .to.emit(ghostProtocol, "EvidenceSubmitted")
      .withArgs(proofHash, submitter.address, severity, false, reward, "Orbiting");

    const afterBalance = await ghostedToken.balanceOf(submitter.address);
    expect(afterBalance - beforeBalance).to.equal(reward);
  });

  it("uses the token decimals when previewing the ETH unlock price", async function () {
    const { ghostProtocol, submitter } = await deployFixture();
    const proofHash = ethers.id("proof-smoke-2");

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 50n, "story", "crypto", "", false, {
        value: ethers.parseEther("0.0095"),
      });

    expect(await ghostProtocol.previewUnlockPriceInEth(proofHash)).to.equal(500000000000000n);
  });

  it("unlocks by credibility when the token supports credibility scores", async function () {
    const { ghostProtocol, ghostedToken, submitter, unlocker } = await deployFixture();
    const proofHash = ethers.id("proof-smoke-3");

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 80n, "cred path", "Orbiting", "", false, {
        value: ethers.parseEther("0.0095"),
      });

    await ghostedToken.seedCredibilityScore(unlocker.address, ethers.parseEther("1200"));

    await expect(ghostProtocol.connect(unlocker).unlockStoryByCredibility(proofHash))
      .to.emit(ghostProtocol, "StoryUnlocked")
      .withArgs(proofHash, unlocker.address, 0n, "CREDIBILITY");

    expect(await ghostProtocol.canUserAccessStory(proofHash, unlocker.address)).to.equal(true);
  });

  it("tracks protocol credibility separately from token credibility", async function () {
    const { ghostProtocol, submitter, unlocker, oracle } = await deployFixture();
    const proofHash = ethers.id("proof-smoke-cred-ledger");

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 65n, "truth path", "crypto", "", false, {
        value: ethers.parseEther("0.0095"),
      });

    await ghostProtocol.connect(unlocker).assertTruth(proofHash, true);
    await ghostProtocol.connect(oracle).resolveTruth(proofHash, 0n, true);

    const credibility = await ghostProtocol.getUserCredibility(unlocker.address);
    expect(credibility[0]).to.equal(0n);
    expect(credibility[1]).to.equal(ethers.parseEther("100"));
    expect(credibility[2]).to.equal(ethers.parseEther("100"));
  });

  it("rejects ETH unlock previews when the quote is stale", async function () {
    const { ghostProtocol, submitter } = await deployFixture();
    const proofHash = ethers.id("proof-smoke-stale-quote");

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 40n, "stale quote path", "crypto", "", false, {
        value: ethers.parseEther("0.0095"),
      });

    await ethers.provider.send("evm_increaseTime", [86_401]);
    await ethers.provider.send("evm_mine", []);

    await expect(ghostProtocol.previewUnlockPriceInEth(proofHash))
      .to.be.revertedWithCustomError(ghostProtocol, "StaleUnlockPriceQuote");
  });

  it("withdraws retained protocol ETH to treasury", async function () {
    const { ghostProtocol, treasury, submitter } = await deployFixture();
    const proofHash = ethers.id("proof-smoke-4");
    const fee = ethers.parseEther("0.0095");
    const treasuryCut = (fee * 3000n) / 10000n;
    const protocolCut = fee - treasuryCut;

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 50n, "withdraw path", "crypto", "", false, {
        value: fee,
      });

    const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);

    await expect(ghostProtocol.withdrawProtocolETH(protocolCut))
      .to.emit(ghostProtocol, "ProtocolRevenueWithdrawn")
      .withArgs(treasury.address, protocolCut);

    const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);
    expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(protocolCut);

    const stats = await ghostProtocol.getProtocolStats();
    expect(stats[8]).to.equal(protocolCut);
    expect(stats[9]).to.equal(protocolCut);
    expect(stats[10]).to.equal(0n);
  });
});