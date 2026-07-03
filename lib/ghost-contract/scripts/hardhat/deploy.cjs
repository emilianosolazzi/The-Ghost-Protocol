const fs = require("node:fs");
const path = require("node:path");
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying GhostProtocol contracts to localhost...");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

  const MockToken = await ethers.getContractFactory("MockERC20");
  const ghostedToken = await MockToken.deploy("GHOSTED", "GHOSTED", ethers.parseEther("1000000"));
  await ghostedToken.waitForDeployment();
  const tokenAddress = await ghostedToken.getAddress();
  console.log(`GHOSTED token deployed to: ${tokenAddress}`);

  const GhostProtocol = await ethers.getContractFactory("GhostProtocol");
  const ghostProtocol = await GhostProtocol.deploy(
    tokenAddress,
    deployer.address,
    deployer.address,
  );
  await ghostProtocol.waitForDeployment();
  const contractAddress = await ghostProtocol.getAddress();
  console.log(`GhostProtocol deployed to: ${contractAddress}`);

  await ghostedToken.setProtocol(contractAddress);
  await ghostProtocol.setUnlockPriceQuote(1_000_000_000_000n);

  const rewardFunding = ethers.parseEther("250000");
  await ghostedToken.transfer(contractAddress, rewardFunding);
  console.log(`Funded protocol with ${ethers.formatEther(rewardFunding)} GHOSTED`);

  const deploymentInfo = {
    network: "localhost",
    chainId: 31337,
    deployer: deployer.address,
    ghostedToken: tokenAddress,
    ghostProtocol: contractAddress,
    deployedAt: new Date().toISOString(),
  };

  const outputPath = path.join(__dirname, "../../deployment-localhost.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(deploymentInfo, null, 2)}\n`, "utf8");

  console.log(`Deployment info saved to: ${outputPath}`);
  console.log("\nUse these values for local frontend env:");
  console.log(`VITE_GHOST_PROTOCOL_ADDRESS=${contractAddress}`);
  console.log("VITE_GHOST_PROTOCOL_RPC_URL=http://127.0.0.1:8545");
  console.log("VITE_GHOST_PROTOCOL_CHAIN_ID=31337");
  console.log("VITE_GHOST_PROTOCOL_EXPLORER_URL=http://localhost:3000");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
