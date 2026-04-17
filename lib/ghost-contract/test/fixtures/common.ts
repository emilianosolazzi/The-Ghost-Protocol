import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

export interface TestFixtures {
  ghostProtocol: any;
  ghostedToken: any;
  deployer: SignerWithAddress;
  oracle: SignerWithAddress;
  treasury: SignerWithAddress;
  user1: SignerWithAddress;
  user2: SignerWithAddress;
  user3: SignerWithAddress;
}

export async function deployFixtures(): Promise<TestFixtures> {
  const [deployer, oracle, treasury, user1, user2, user3] =
    await ethers.getSigners();

  // Deploy mock token
  const MockToken = await ethers.getContractFactory("MockERC20");
  const ghostedToken: any = await MockToken.deploy(
    "GHOSTED",
    "GHOSTED",
    ethers.parseEther("10000000")
  );
  await ghostedToken.waitForDeployment();
  const tokenAddress = await ghostedToken.getAddress();

  // Deploy GhostProtocol
  const GhostProtocol = await ethers.getContractFactory("GhostProtocol");
  const ghostProtocol: any = await GhostProtocol.deploy(
    tokenAddress,
    treasury.address,
    oracle.address
  );
  await ghostProtocol.waitForDeployment();
  await ghostedToken.setProtocol(await ghostProtocol.getAddress());
  await ghostProtocol.connect(oracle).setUnlockPriceQuote(1_000_000_000_000n);

  // Transfer some tokens to users for testing
  const tokensPerUser = ethers.parseEther("10000");
  await ghostedToken.transfer(user1.address, tokensPerUser);
  await ghostedToken.transfer(user2.address, tokensPerUser);
  await ghostedToken.transfer(user3.address, tokensPerUser);

  // Approve the GhostProtocol contract to spend user tokens
  await ghostedToken
    .connect(user1)
    .approve(
      await ghostProtocol.getAddress(),
      ethers.parseEther("9999999999")
    );
  await ghostedToken
    .connect(user2)
    .approve(
      await ghostProtocol.getAddress(),
      ethers.parseEther("9999999999")
    );
  await ghostedToken
    .connect(user3)
    .approve(
      await ghostProtocol.getAddress(),
      ethers.parseEther("9999999999")
    );

  return {
    ghostProtocol,
    ghostedToken,
    deployer,
    oracle,
    treasury,
    user1,
    user2,
    user3,
  };
}

export const TEST_CONSTANTS = {
  RECEIPT_FEE: ethers.parseEther("0.0095"),
  TREASURY_SPLIT_BPS: 3000n,
  BPS_DENOMINATOR: 10000n,
  MAX_GHOSTED_PER_SUBMISSION: ethers.parseEther("5000"),
  TRUTH_ASSERTION_STAKE: ethers.parseEther("100"),
  TRUTH_WIN_REWARD: ethers.parseEther("200"),
  BASE_UNLOCK_PRICE: ethers.parseEther("500"),
  CREDIBILITY_UNLOCK_THRESHOLD: ethers.parseEther("1000"),
  MIN_SEVERITY: 1,
  MAX_SEVERITY: 100,
};

export function generateProofHash(seed: number): string {
  return ethers.id(`proof-${seed}`);
}

export function generateDramaType(index: number): string {
  const types = ["crypto", "social", "gaming", "defi", "meme"];
  return types[index % types.length];
}
