import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const mochaBin = require.resolve("mocha/bin/mocha.js");

const env = {
  ...process.env,
  TS_NODE_TRANSPILE_ONLY: "1",
};

const result = spawnSync(
  process.execPath,
  [
    "--experimental-specifier-resolution=node",
    "--loader",
    "ts-node/esm",
    mochaBin,
    "--require",
    "hardhat/register.js",
    "--extension",
    "ts",
    "./test/**/*.test.ts",
  ],
  {
    cwd: process.cwd(),
    env,
    stdio: "inherit",
  },
);

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
