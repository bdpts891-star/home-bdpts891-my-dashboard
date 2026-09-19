# PROKRITO-LIVE implementation path

## What was added in Phase 2

This phase creates the backend foundation without pretending that payments or production streaming are already complete:

- Node.js API server with Express
- Security headers through Helmet
- CORS configuration through environment variables
- Health endpoint: `GET /api/health`
- Room endpoints: `GET /api/rooms`, `POST /api/rooms`
- Activity endpoint: `GET /api/activity`
- Socket.IO events for room snapshots, joining rooms, chat and gifts
- PostgreSQL-first schema for users, rooms, wallets, transactions and moderation reports
- Environment variable template

## Run the foundation locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:8080`. The existing dashboard remains the web client, while the API is available under `/api`.

## Correct production order

1. **Identity first** — add OTP/email login, refresh-token rotation, device sessions, RBAC and audit logs.
2. **Data layer** — use PostgreSQL migrations, transaction boundaries and idempotency keys for every wallet operation.
3. **Realtime signaling** — use Socket.IO for chat/control-plane events and a dedicated WebRTC SFU (LiveKit, Janus, mediasoup or an equivalent) for audio/video media.
4. **Wallet safety** — ledger-based accounting, double-entry reconciliation, webhook signature verification and an immutable transaction log.
5. **Moderation** — reports, block/mute/ban workflows, human review and AI suggestions with an override.
6. **Payments** — integrate one gateway in sandbox mode first; only then enable production recharge and withdrawal.
7. **Observability** — structured logs, error tracking, uptime checks, queue monitoring and room quality metrics.
8. **Release** — staging environment, database backups, load tests, security review, app-store compliance and a canary rollout.

## Important boundary

The current API uses in-memory sample data intentionally. Do not use it as a production wallet, user store or live-media service. Replace the arrays in `server/index.js` with repository/service modules backed by PostgreSQL and Redis before launch.
