import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Setting up local deployment...");

  // Connect to local hardhat node
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  // Use the first hardhat account (known private key)
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const signer = new ethers.Wallet(privateKey, provider);
  
  console.log(`Preparing deployment with account: ${signer.address}`);

  try {
    const balance = await provider.getBalance(signer.address);
    console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);
  } catch (error) {
    console.error("Could not connect to Hardhat node. Is it running?");
    process.exit(1);
  }

  // Generate mock addresses for local testing
  const tokenAddress = ethers.getAddress("0x" + "1".repeat(40));
  const contractAddress = ethers.getAddress("0x" + "2".repeat(40));
  
  console.log(`\nMock GHOSTED token: ${tokenAddress}`);
  console.log(`Mock GhostProtocol: ${contractAddress}`);

  // Save deployment info
  const deploymentInfo = {
    network: "localhost",
    chainId: 31337,
    deployer: signer.address,
    ghostedToken: tokenAddress,
    ghostProtocol: contractAddress,
    hardhatPrivateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    nodeUrl: "http://127.0.0.1:8545",
    deployedAt: new Date().toISOString(),
  };

  const outputPath = path.join(__dirname, "../deployment-localhost.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment config saved to: ${outputPath}`);

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
