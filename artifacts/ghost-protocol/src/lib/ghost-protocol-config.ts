import { getAddress, isAddress, type Address, type Chain } from "viem";

export type GhostProtocolRuntimeConfig = {
  address: Address | null;
  chainId: number | null;
  rpcUrl: string | null;
  explorerUrl: string | null;
  isConfigured: boolean;
  issues: string[];
};

function parsePositiveInteger(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function getGhostProtocolChain(): Chain | null {
  const config = getGhostProtocolConfig();

  if (!config.chainId || !config.rpcUrl) {
    return null;
  }

  return {
    id: config.chainId,
    name: config.chainId === 31337 ? "Hardhat Local" : `GhostProtocol Chain ${config.chainId}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [config.rpcUrl],
      },
      public: {
        http: [config.rpcUrl],
      },
    },
    blockExplorers: config.explorerUrl
      ? {
          default: {
            name: "Explorer",
            url: config.explorerUrl,
          },
        }
      : undefined,
    testnet: config.chainId !== 1,
  } satisfies Chain;
}

export function getGhostProtocolConfig(): GhostProtocolRuntimeConfig {
  const issues: string[] = [];
  const rawAddress = import.meta.env.VITE_GHOST_PROTOCOL_ADDRESS?.trim();
  const rawRpcUrl = import.meta.env.VITE_GHOST_PROTOCOL_RPC_URL?.trim();
  const rawExplorerUrl = import.meta.env.VITE_GHOST_PROTOCOL_EXPLORER_URL?.trim();
  const rawChainId = import.meta.env.VITE_GHOST_PROTOCOL_CHAIN_ID?.trim();

  let address: Address | null = null;
  if (rawAddress) {
    if (isAddress(rawAddress)) {
      address = getAddress(rawAddress);
    } else {
      issues.push("VITE_GHOST_PROTOCOL_ADDRESS is not a valid EVM address.");
    }
  }

  const chainId = parsePositiveInteger(rawChainId);
  if (rawChainId && chainId === null) {
    issues.push("VITE_GHOST_PROTOCOL_CHAIN_ID must be a positive integer.");
  }

  const rpcUrl = rawRpcUrl && rawRpcUrl.length > 0 ? rawRpcUrl : null;
  const explorerUrl = rawExplorerUrl && rawExplorerUrl.length > 0 ? rawExplorerUrl.replace(/\/+$/, "") : null;

  return {
    address,
    chainId,
    rpcUrl,
    explorerUrl,
    isConfigured: Boolean(address && rpcUrl),
    issues,
  };
}