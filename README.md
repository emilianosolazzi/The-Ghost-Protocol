# The-Ghost-Protocol

"Memecoin by day. Truth registry by night."

GhostProtocol is a dark-fun, on-chain GameFi memecoin experiment where users submit evidence, earn $GHOSTED rewards based on severity, and unlock story content through token-driven progression. Built with Solidity, React, and TypeScript, it blends verifiable on-chain actions with social gameplay.

---

## The Legend of the Great On-Chain Cold Shoulder

> "In the beginning, there was the Whitepaper of Broken Promises. It was written in the tears of those who waited three business days for a 'Haha, sorry, just saw this!' text."

Humanity was tired of the Seen receipt. We needed something more immutable. Something that lived on Ethereum. So we forged the GHOSTED Protocol.

---

### The Ghosting Receipt: On-Chain Proof

You submit a hash of your evidence, a severity score, and a drama type. The contract timestamps it forever. Nobody can edit it. Nobody can delete it.

- A treasury split routes part of the fee to protocol treasury.
- The remaining portion stays in protocol accounting.
- Direct victims (non-proxy) can earn $GHOSTED rewards based on severity.

The contract tracks the difference between direct and proxy submissions.

---

### The Proxy Witness

Not everyone submitting is the one who got ghosted. You can file on behalf of a friend as a proxy submission. Proxies are tracked separately and do not receive direct-victim rewards.

---

### The Locked Story

Every piece of evidence becomes a Locked Story. Details are gated until unlocked.

Unlock paths include:

- Burn-based unlocks with tokenomics effects.
- Credibility-based unlocks for qualified users.
- Direct ETH unlock payments to submitters.

Every unlock can influence future access dynamics.

---

### The Ritual of Truth

Users can stake $GHOSTED to assert whether a story is real or fake. Assertions are resolved by protocol authority/oracle logic, with rewards or penalties based on correctness.

---

### The Credibility Score

Credibility is earned, not bought. Correct assertions and responsible participation can improve standing and influence protocol access paths.

---

### The Burn and Revenue Loops

Burn and payout mechanics connect usage to token supply pressure and submitter incentives. Protocol participation is designed to produce both social signaling and economic consequences.

---

### Governance and Safety Controls

Ownership transfer uses a two-step pattern (propose and accept). Critical controls (oracle, treasury, pause flows) are designed with explicit operational safety paths.

---

### What the Contract Does Not Do

The contract does not read your private messages and does not adjudicate emotional truth itself. It stores immutable references, timestamps, and interaction outcomes.

The truth stays in the original content. The chain anchors the proof.

---

## Serious Beyond Fun

The memecoin framing is the business model.
The evidence registry is the product.

Evidence submissions follow a content-addressable flow:

```text
keccak256(content) -> IPFS or Arweave CID -> proofHash on-chain
```

This allows verifiable, timestamped claims with immutable anchoring to chain state.

---

## Local Dev Runbook

### 1) Install dependencies

```bash
corepack enable
corepack pnpm install
```

### 2) Start a local chain

In terminal A:

```bash
corepack pnpm --filter @workspace/ghost-contract run hardhat:node
```

### 3) Deploy contracts to localhost

In terminal B:

```bash
corepack pnpm --filter @workspace/ghost-contract run hardhat:deploy
```

This writes deployment output to `lib/ghost-contract/deployment-localhost.json` and prints the `VITE_GHOST_PROTOCOL_*` values to copy into `.env.local`.

### 4) Validate tokenomics on localhost

With the local node still running:

```bash
corepack pnpm --filter @workspace/ghost-contract run hardhat:test:localhost
```

The smoke suite covers:

- direct-vs-proxy reward behavior
- fee split accounting (treasury vs retained protocol revenue)
- burn unlock split (50% burn / 50% submitter)
- wrong-truth penalty split (50% burn / 50% submitter)
- retained protocol ETH withdrawal to treasury

### 5) Wire local SQL for archive APIs

You need a reachable PostgreSQL instance. Either bring one up via Docker, or point at a natively installed PostgreSQL (no Docker required).

**Option A — Docker:**

```bash
corepack pnpm run db:up
```

**Option B — native PostgreSQL install (no Docker):** create a database on your existing local server, e.g.:

```powershell
$env:PGPASSWORD = "<your-postgres-password>"
& "C:\Program Files\PostgreSQL\<version>\bin\psql.exe" -h 127.0.0.1 -p <port> -U postgres -d postgres -c "CREATE DATABASE hype_coin_dao;"
```

(`<port>` is whatever your local server listens on — check with `Get-Service postgresql*` / `Get-NetTCPConnection -State Listen` if you have more than one PostgreSQL version installed side by side, e.g. 5432 vs 5433.)

Apply Drizzle schema (works the same for either option — just point `DATABASE_URL` at the right instance):

```powershell
$env:DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/hype_coin_dao"
corepack pnpm run db:push
```

Note: `DATABASE_URL` is read directly from the process environment (`lib/db/src/index.ts`) — it is **not** loaded from `.env`/`.env.local` for the api-server or `db:push` at runtime, only `drizzle.config.ts` reads plain `.env` via `dotenv/config`. Export it in your shell before running `db:push` or starting the api-server.

If you get `28P01` (password authentication failed), your running Postgres instance is using different credentials/port than the default profile above. Either:

- stop the existing instance and use `corepack pnpm run db:up`, or
- update `DATABASE_URL` in your local env to match your actual Postgres username, password, and port.

### 6) Start backend and frontend

Backend:

```bash
corepack pnpm --filter @workspace/api-server run dev
```

Frontend:

```bash
corepack pnpm --filter @workspace/ghost-protocol run dev
```

---

## Troubleshooting

- `pnpm: command not found`: run commands through `corepack pnpm ...`.
- Docker compose cannot connect to daemon: start Docker Desktop first.
- Archive endpoints return 500 with Postgres auth errors: validate `DATABASE_URL` and rerun `corepack pnpm run db:push`.
