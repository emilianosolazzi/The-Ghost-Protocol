import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import solc from "solc";
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");

const hardhatRpcUrl = "http://127.0.0.1:8545";
const hardhatPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const receiptFeeEth = "0.0095";

const ghostProtocolSource = await readFile(
  path.join(packageRoot, "contracts", "GhostProtocol.sol"),
  "utf8",
);

const mockGhostedTokenSource = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockGhostedToken {
    string public constant name = "GHOSTED";
    string public constant symbol = "GHOSTED";
    uint8 public constant decimals = 18;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public credibilityScore;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    constructor(address initialHolder, uint256 initialSupply) {
        balanceOf[initialHolder] = initialSupply;
        emit Transfer(address(0), initialHolder, initialSupply);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        if (msg.sender != from) {
            uint256 allowed = allowance[from][msg.sender];
            require(allowed >= amount, "INSUFFICIENT_ALLOWANCE");
            unchecked {
                allowance[from][msg.sender] = allowed - amount;
            }
        }

        _transfer(from, to, amount);
        return true;
    }

    function burn(address from, uint256 amount) external {
        if (msg.sender != from) {
            uint256 allowed = allowance[from][msg.sender];
            require(allowed >= amount, "INSUFFICIENT_ALLOWANCE");
            unchecked {
                allowance[from][msg.sender] = allowed - amount;
            }
        }

        uint256 currentBalance = balanceOf[from];
        require(currentBalance >= amount, "INSUFFICIENT_BALANCE");
        unchecked {
            balanceOf[from] = currentBalance - amount;
        }
        emit Transfer(from, address(0), amount);
    }

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function updateCredibilityScore(address holder, uint256 newScore) external {
        credibilityScore[holder] = newScore;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "INVALID_RECIPIENT");
        uint256 currentBalance = balanceOf[from];
        require(currentBalance >= amount, "INSUFFICIENT_BALANCE");
        unchecked {
            balanceOf[from] = currentBalance - amount;
        }
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }
}
`;

const input = {
  language: "Solidity",
  sources: {
    "GhostProtocol.sol": { content: ghostProtocolSource },
    "MockGhostedToken.sol": { content: mockGhostedTokenSource },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const diagnostics = output.errors ?? [];
const compileErrors = diagnostics.filter((diagnostic) => diagnostic.severity === "error");

for (const diagnostic of diagnostics) {
  console.log(diagnostic.formattedMessage.trim());
}

if (compileErrors.length > 0) {
  process.exit(1);
}

const mockTokenOutput = output.contracts?.["MockGhostedToken.sol"]?.MockGhostedToken;
const ghostProtocolOutput = output.contracts?.["GhostProtocol.sol"]?.GhostProtocol;

if (!mockTokenOutput || !ghostProtocolOutput) {
  throw new Error("Compilation did not emit the expected contracts.");
}

const provider = new ethers.JsonRpcProvider(hardhatRpcUrl);
const signer = new ethers.NonceManager(new ethers.Wallet(hardhatPrivateKey, provider));
const deployerAddress = await signer.getAddress();

const mockTokenFactory = new ethers.ContractFactory(
  mockTokenOutput.abi,
  `0x${mockTokenOutput.evm.bytecode.object}`,
  signer,
);

const protocolFactory = new ethers.ContractFactory(
  ghostProtocolOutput.abi,
  `0x${ghostProtocolOutput.evm.bytecode.object}`,
  signer,
);

console.log(`Using deployer ${deployerAddress}`);

const mockToken = await mockTokenFactory.deploy(
  deployerAddress,
  ethers.parseEther("1000000000"),
);
await mockToken.waitForDeployment();
const mockTokenAddress = await mockToken.getAddress();
console.log(`MockGhostedToken deployed at ${mockTokenAddress}`);

const protocol = await protocolFactory.deploy(
  mockTokenAddress,
  deployerAddress,
  deployerAddress,
);
await protocol.waitForDeployment();
const protocolAddress = await protocol.getAddress();
console.log(`GhostProtocol deployed at ${protocolAddress}`);

const rewardFunding = ethers.parseEther("50000000");
await (await mockToken.transfer(protocolAddress, rewardFunding)).wait();
await (await mockToken.updateCredibilityScore(deployerAddress, ethers.parseEther("5000"))).wait();
console.log(`Funded protocol with ${ethers.formatEther(rewardFunding)} GHOSTED`);

const proofHash = ethers.keccak256(ethers.toUtf8Bytes("hardhat-smoke-proof"));
const submitReceipt = await (
  await protocol.submitEvidence(
    proofHash,
    42,
    "hardhat smoke test",
    "hardhat",
    false,
    { value: ethers.parseEther(receiptFeeEth) },
  )
).wait();

const parsedEvents = submitReceipt.logs
  .map((log) => {
    try {
      return protocol.interface.parseLog(log);
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .map((entry) => entry.name);

console.log(`Smoke proof hash: ${proofHash}`);
console.log(`Smoke tx hash: ${submitReceipt.hash}`);
console.log(`Smoke events: ${parsedEvents.join(", ")}`);

const deploymentInfo = {
  network: "hardhat-local",
  rpcUrl: hardhatRpcUrl,
  chainId: 31337,
  deployer: deployerAddress,
  ghostedToken: mockTokenAddress,
  ghostProtocol: protocolAddress,
  smokeProofHash: proofHash,
  smokeTransactionHash: submitReceipt.hash,
  emittedEvents: parsedEvents,
  deployedAt: new Date().toISOString(),
};

const deploymentPath = path.join(packageRoot, "artifacts", "deployment-hardhat-local.json");
await mkdir(path.dirname(deploymentPath), { recursive: true });
await writeFile(deploymentPath, `${JSON.stringify(deploymentInfo, null, 2)}\n`, "utf8");

console.log(`Wrote deployment info to ${deploymentPath}`);