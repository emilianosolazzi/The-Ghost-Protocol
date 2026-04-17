/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GHOST_ARCHIVE_API_URL?: string;
  readonly VITE_GHOST_PROTOCOL_ADDRESS?: string;
  readonly VITE_GHOST_PROTOCOL_CHAIN_ID?: string;
  readonly VITE_GHOST_PROTOCOL_RPC_URL?: string;
  readonly VITE_GHOST_PROTOCOL_EXPLORER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}