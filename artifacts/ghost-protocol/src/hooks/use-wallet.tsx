import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createWalletClient, custom, getAddress, http, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { getGhostProtocolChain, getGhostProtocolConfig } from "@/lib/ghost-protocol-config";

type RequestArguments = {
  method: string;
  params?: unknown[] | object;
};

type InjectedProvider = {
  request(args: RequestArguments): Promise<unknown>;
  on?(event: string, listener: (...args: unknown[]) => void): void;
  removeListener?(event: string, listener: (...args: unknown[]) => void): void;
};

declare global {
  interface Window {
    ethereum?: InjectedProvider;
  }
}

type WalletContextValue = {
  account: Address | null;
  chainId: number | null;
  isConnected: boolean;
  isWalletAvailable: boolean;
  connectionType: "injected" | "hardhat-dev" | "none";
  connect: () => Promise<Address>;
  disconnect: () => void;
  getWalletClient: () => ReturnType<typeof createWalletClient>;
  switchChain: (targetChainId: number) => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | null>(null);

const HARDHAT_DEV_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as const;

type HardhatDevWalletConfig = {
  account: Address;
  chainId: number;
  rpcUrl: string;
  privateKey: `0x${string}`;
};

function parseAccounts(value: unknown): Address[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (typeof entry !== "string") {
      return [];
    }

    try {
      return [getAddress(entry)];
    } catch {
      return [];
    }
  });
}

function parseChainId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    if (value.startsWith("0x")) {
      const parsedHex = Number.parseInt(value, 16);
      return Number.isFinite(parsedHex) ? parsedHex : null;
    }

    const parsedDecimal = Number.parseInt(value, 10);
    return Number.isFinite(parsedDecimal) ? parsedDecimal : null;
  }

  return null;
}

export function formatWalletAddress(address: string | null): string {
  if (!address) {
    return "Connect wallet";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getHardhatDevWalletConfig(): HardhatDevWalletConfig | null {
  const config = getGhostProtocolConfig();

  if (!config.rpcUrl || config.chainId !== 31337) {
    return null;
  }

  try {
    const rpc = new URL(config.rpcUrl);
    const isLocalHost = rpc.hostname === "127.0.0.1" || rpc.hostname === "localhost";
    if (!isLocalHost) {
      return null;
    }
  } catch {
    return null;
  }

  const account = privateKeyToAccount(HARDHAT_DEV_PRIVATE_KEY).address;
  return {
    account,
    chainId: 31337,
    rpcUrl: config.rpcUrl,
    privateKey: HARDHAT_DEV_PRIVATE_KEY,
  };
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Address | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const provider = typeof window !== "undefined" ? window.ethereum : undefined;
  const hardhatDevWallet = getHardhatDevWalletConfig();
  const connectionType = provider ? "injected" : hardhatDevWallet ? "hardhat-dev" : "none";

  useEffect(() => {
    if (!provider) {
      return;
    }

    const injectedProvider = provider;

    let cancelled = false;

    async function syncWalletState() {
      const [accountsResponse, chainIdResponse] = await Promise.all([
        injectedProvider.request({ method: "eth_accounts" }),
        injectedProvider.request({ method: "eth_chainId" }),
      ]);

      if (cancelled) {
        return;
      }

      const accounts = parseAccounts(accountsResponse);
      setAccount(accounts[0] ?? null);
      setChainId(parseChainId(chainIdResponse));
    }

    const handleAccountsChanged = (accountsResponse: unknown) => {
      const accounts = parseAccounts(accountsResponse);
      setAccount(accounts[0] ?? null);
    };

    const handleChainChanged = (chainIdResponse: unknown) => {
      setChainId(parseChainId(chainIdResponse));
    };

    syncWalletState().catch(() => {
      if (!cancelled) {
        setAccount(null);
      }
    });

    injectedProvider.on?.("accountsChanged", handleAccountsChanged);
    injectedProvider.on?.("chainChanged", handleChainChanged);

    return () => {
      cancelled = true;
      injectedProvider.removeListener?.("accountsChanged", handleAccountsChanged);
      injectedProvider.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [provider]);

  useEffect(() => {
    if (provider || !hardhatDevWallet) {
      return;
    }

    setAccount((currentAccount) => currentAccount ?? hardhatDevWallet.account);
    setChainId((currentChainId) => currentChainId ?? hardhatDevWallet.chainId);
  }, [provider, hardhatDevWallet]);

  async function connect(): Promise<Address> {
    if (!provider && hardhatDevWallet) {
      setAccount(hardhatDevWallet.account);
      setChainId(hardhatDevWallet.chainId);
      return hardhatDevWallet.account;
    }

    if (!provider) {
      throw new Error("No injected wallet was found, and no local Hardhat dev wallet is configured.");
    }

    const accountsResponse = await provider.request({ method: "eth_requestAccounts" });
    const chainIdResponse = await provider.request({ method: "eth_chainId" });
    const accounts = parseAccounts(accountsResponse);

    if (accounts.length === 0) {
      throw new Error("Wallet connection succeeded but no account was returned.");
    }

    setAccount(accounts[0]);
    setChainId(parseChainId(chainIdResponse));
    return accounts[0];
  }

  function disconnect() {
    setAccount(null);
  }

  function getWalletClient() {
    const chain = getGhostProtocolChain() ?? undefined;

    if (!provider && hardhatDevWallet) {
      return createWalletClient({
        account: privateKeyToAccount(hardhatDevWallet.privateKey),
        chain,
        transport: http(hardhatDevWallet.rpcUrl),
      });
    }

    if (!provider) {
      throw new Error("No injected wallet was found, and no local Hardhat dev wallet is configured.");
    }

    return createWalletClient({
      chain,
      transport: custom(provider),
    });
  }

  async function switchChain(targetChainId: number) {
    if (!provider && hardhatDevWallet) {
      if (targetChainId !== hardhatDevWallet.chainId) {
        throw new Error(`The embedded Hardhat wallet only supports chain ${hardhatDevWallet.chainId}.`);
      }

      setChainId(hardhatDevWallet.chainId);
      return;
    }

    if (!provider) {
      throw new Error("No injected wallet was found, and no local Hardhat dev wallet is configured.");
    }

    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${targetChainId.toString(16)}` }],
    });

    const nextChainId = await provider.request({ method: "eth_chainId" });
    setChainId(parseChainId(nextChainId));
  }

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        isConnected: Boolean(account),
        isWalletAvailable: Boolean(provider || hardhatDevWallet),
        connectionType,
        connect,
        disconnect,
        getWalletClient,
        switchChain,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider.");
  }

  return context;
}