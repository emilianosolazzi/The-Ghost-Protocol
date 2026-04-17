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
        .submitEvidence(proofHash, severity, "oh it hurts", "Orbiting", false, {
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
      .submitEvidence(proofHash, 50n, "story", "crypto", false, {
        value: ethers.parseEther("0.0095"),
      });

    expect(await ghostProtocol.previewUnlockPriceInEth(proofHash)).to.equal(500000000000000n);
  });
});