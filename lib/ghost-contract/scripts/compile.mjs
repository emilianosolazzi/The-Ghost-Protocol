import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import solc from "solc";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const sourcePath = path.join(packageRoot, "contracts", "GhostProtocol.sol");
const artifactDir = path.join(packageRoot, "artifacts");
const artifactPath = path.join(artifactDir, "GhostProtocol.json");
const generatedDir = path.join(packageRoot, "src", "generated");
const generatedPath = path.join(generatedDir, "ghost-protocol.ts");

const source = await readFile(sourcePath, "utf8");

function findImports(importPath) {
  const candidates = [
    path.resolve(packageRoot, "contracts", importPath),
    path.resolve(packageRoot, "node_modules", importPath),
    path.resolve(packageRoot, "..", "..", "node_modules", importPath),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return { contents: readFileSync(candidate, "utf8") };
    }
  }

  return { error: `File not found: ${importPath}` };
}

const input = {
  language: "Solidity",
  sources: {
    "GhostProtocol.sol": {
      content: source,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object", "metadata"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
const diagnostics = output.errors ?? [];
const compileErrors = diagnostics.filter((diagnostic) => diagnostic.severity === "error");

if (diagnostics.length > 0) {
  for (const diagnostic of diagnostics) {
    console.log(diagnostic.formattedMessage.trim());
  }
}

if (compileErrors.length > 0) {
  process.exit(1);
}

const contractOutput = output.contracts?.["GhostProtocol.sol"]?.GhostProtocol;

if (!contractOutput) {
  console.error("GhostProtocol compilation did not emit a contract artifact.");
  process.exit(1);
}

const abi = contractOutput.abi;
const bytecodeObject = contractOutput.evm?.bytecode?.object ?? "";
const deployedBytecodeObject = contractOutput.evm?.deployedBytecode?.object ?? "";
const bytecode = bytecodeObject ? `0x${bytecodeObject}` : "0x";
const deployedBytecode = deployedBytecodeObject ? `0x${deployedBytecodeObject}` : "0x";

const artifact = {
  contractName: "GhostProtocol",
  sourceName: "GhostProtocol.sol",
  compilerVersion: solc.version(),
  abi,
  bytecode,
  deployedBytecode,
  metadata: contractOutput.metadata ? JSON.parse(contractOutput.metadata) : null,
};

const generatedSource = `${[
  'export const ghostProtocolContractName = "GhostProtocol" as const;',
  "",
  `export const ghostProtocolAbi = ${JSON.stringify(abi, null, 2)} as const;`,
  "",
  `export const ghostProtocolBytecode = ${JSON.stringify(bytecode)} as const;`,
  "",
  `export const ghostProtocolDeployedBytecode = ${JSON.stringify(deployedBytecode)} as const;`,
  "",
  "export const ghostProtocolArtifact = {",
  "  contractName: ghostProtocolContractName,",
  "  abi: ghostProtocolAbi,",
  "  bytecode: ghostProtocolBytecode,",
  "  deployedBytecode: ghostProtocolDeployedBytecode,",
  "} as const;",
].join("\n")}\n`;

await mkdir(artifactDir, { recursive: true });
await mkdir(generatedDir, { recursive: true });
await writeFile(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
await writeFile(generatedPath, generatedSource, "utf8");

console.log(`Compiled GhostProtocol to ${artifactPath}`);
console.log(`Updated ABI exports at ${generatedPath}`);