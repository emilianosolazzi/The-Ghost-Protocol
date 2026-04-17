import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Deploying GhostProtocol contract...");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);

  // Deploy mock token contract first
  console.log("\nDeploying mock GHOSTED token...");
  const MockToken = await ethers.getContractFactory("MockERC20");
  const ghostedToken = await MockToken.deploy("GHOSTED", "GHOSTED", ethers.utils.parseEther("1000000"));
  await ghostedToken.deployed();
  const tokenAddress = ghostedToken.address;
  console.log(`GHOSTED token deployed to: ${tokenAddress}`);

  // Deploy GhostProtocol contract
  console.log("\nDeploying GhostProtocol contract...");
  const GhostProtocol = await ethers.getContractFactory("GhostProtocol");
  const ghostProtocol = await GhostProtocol.deploy(
    tokenAddress,
    deployer.address,
    deployer.address
  );
  await ghostProtocol.deployed();
  const contractAddress = ghostProtocol.address;
  console.log(`GhostProtocol deployed to: ${contractAddress}`);

  await ghostedToken.setProtocol(contractAddress);
  console.log("Configured mock token protocol authority");

  await ghostProtocol.setUnlockPriceQuote("1000000000000");
  console.log("Seeded unlock price quote: 0.000001 ETH per GHOSTED");

  // Save deployment info
  const deploymentInfo = {
    network: "localhost",
    chainId: 31337,
    deployer: deployer.address,
    ghostedToken: tokenAddress,
    ghostProtocol: contractAddress,
    deployedAt: new Date().toISOString(),
  };

  const outputPath = path.join(__dirname, "../../deployment-localhost.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to: ${outputPath}`);

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
