import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Deploying GhostProtocol contract...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);

  // Get account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

  // Deploy mock token contract first (for testing)
  console.log("\nDeploying mock GHOSTED token...");
  const MockToken = await ethers.getContractFactory("MockERC20");
  const ghostedToken = await MockToken.deploy("GHOSTED", "GHOSTED", ethers.parseEther("1000000"));
  await ghostedToken.waitForDeployment();
  const tokenAddress = await ghostedToken.getAddress();
  console.log(`GHOSTED token deployed to: ${tokenAddress}`);

  // Deploy GhostProtocol contract
  console.log("\nDeploying GhostProtocol contract...");
  const GhostProtocol = await ethers.getContractFactory("GhostProtocol");
  const ghostProtocol = await GhostProtocol.deploy(
    tokenAddress,           // ghostedToken
    deployer.address,       // treasury
    deployer.address        // oracle
  );
  await ghostProtocol.waitForDeployment();
  const contractAddress = await ghostProtocol.getAddress();
  console.log(`GhostProtocol deployed to: ${contractAddress}`);

  console.log("\nFunding GhostProtocol with local test rewards...");
  const rewardFunding = ethers.parseEther("250000");
  await ghostedToken.transfer(contractAddress, rewardFunding);
  console.log(`Transferred ${ethers.formatEther(rewardFunding)} GHOSTED to protocol`);

  // Save deployment info
  const deploymentInfo = {
    network: "localhost",
    chainId: 31337,
    deployer: deployer.address,
    ghostedToken: tokenAddress,
    ghostProtocol: contractAddress,
    deployedAt: new Date().toISOString(),
  };

  const outputPath = path.join(__dirname, "../../../artifacts/deployment-localhost.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to: ${outputPath}`);

  // Output for .env.local
  console.log("\n═══════════════════════════════════════");
  console.log("Add these to your .env.local:");
  console.log("═══════════════════════════════════════");
  console.log(`VITE_GHOST_PROTOCOL_ADDRESS=${contractAddress}`);
  console.log(`VITE_GHOST_PROTOCOL_RPC_URL=http://127.0.0.1:8545`);
  console.log(`VITE_GHOST_PROTOCOL_CHAIN_ID=31337`);
  console.log(`VITE_GHOST_PROTOCOL_EXPLORER_URL=http://localhost:3000`);
  console.log("═══════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
