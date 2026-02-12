# Reportheld API – Feasibility Prototype

Minimal self-hosted REST API for exposing Reportheld domain capabilities to n8n, AI tooling, and internal integrations. **Week 1 proof-of-concept** — not a full Reportheld API.

## Quick Start

**Prerequisites:** Node.js (≥18). No database required; all data is hardcoded.

1. **Install and run the API:**

```bash
npm install
cp .env.example .env   # optional
npm run dev
```

- API: **http://localhost:8000** (or the port in `.env`)
- Health: **http://localhost:8000/health**
- **Sites** (hardcoded): **GET /api/v1/sites**

### API key (optional)

If you set **`API_KEY`** in `.env` (or the environment), all **`/api/v1/*`** requests must include that key:

- **Header:** `X-API-Key: your-secret-key`
- **Or:** `Authorization: Bearer your-secret-key`

**`GET /health`** is not protected. Without `API_KEY` set, no key is required (useful for local dev).

## Deploy to Render

To make the API publicly usable (e.g. for n8n or Postman):

1. Push this repo to **GitHub** (or GitLab).
2. Go to [Render](https://render.com) → **New +** → **Web Service** → connect your repo.
3. Set **Build Command:** `npm install && npm run build`  
   **Start Command:** `npm start`  
   (Render sets `PORT` automatically.)
4. Deploy. Your API will be at **`https://<service-name>.onrender.com`**.

Full step-by-step: **[docs/DEPLOY_RENDER.md](docs/DEPLOY_RENDER.md)**.

## Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/health` | Liveness/readiness |
| GET | `/api/v1/sites` | List all sites (level1 + level2 + protocols) |
| GET | `/api/v1/sites/:id` | Get one site (level1) by ID, e.g. `site-1` |
| GET | `/api/v1/sites/level2/:id` | Get one level2 item (with protocols) by ID, e.g. `BT-123450L` |
| GET | `/api/v1/sites/level2/:level2Id/protocols` | List protocols for a level2 item |
| GET | `/api/v1/sites/level2/:level2Id/protocols/:protocolId` | Get one protocol by ID, e.g. `protocol-1` |

### GET /api/v1/sites (hardcoded)

Returns level1 sites with nested level2 and protocols. No database required.

- **GET /api/v1/sites** — full JSON `{ "level1": [ ... ] }` (sites → level2 → protocols)
- **GET /api/v1/sites/site-1** — single site by level1 id (404 if not found)
- **GET /api/v1/sites/level2/BT-123450L** — single level2 item with protocols (404 if not found)
- **GET /api/v1/sites/level2/BT-123450L/protocols** — list protocols for that level2
- **GET /api/v1/sites/level2/BT-123450L/protocols/protocol-1** — single protocol by id (404 if not found)

## cURL Examples

**Health check:**

```bash
curl http://localhost:8000/health
```

**List all sites (hardcoded):**

```bash
curl http://localhost:8000/api/v1/sites
```

If `API_KEY` is set:

```bash
curl -H "X-API-Key: your-secret-key" http://localhost:8000/api/v1/sites
```

**Get site by ID:**

```bash
curl http://localhost:8000/api/v1/sites/site-1
```

**Get level2 item by ID (includes protocols):**

```bash
curl http://localhost:8000/api/v1/sites/level2/BT-123450L
```

**List protocols for a level2 item:**

```bash
curl http://localhost:8000/api/v1/sites/level2/BT-123450L/protocols
```

**Get one protocol by ID:**

```bash
curl http://localhost:8000/api/v1/sites/level2/BT-123450L/protocols/protocol-1
```

## What n8n needs to do to connect and use this API

With the API running locally (`npm run dev`), n8n on the same machine can call:

- **GET** `http://localhost:8000/api/v1/sites` — list all sites (level1 + level2 + protocols)
- **GET** `http://localhost:8000/api/v1/sites/site-1` — get one site by id
- **GET** `http://localhost:8000/api/v1/sites/level2/BT-123450L` — get one level2 item (with protocols)
- **GET** `http://localhost:8000/api/v1/sites/level2/BT-123450L/protocols` — list protocols for a level2
- **GET** `http://localhost:8000/api/v1/sites/level2/BT-123450L/protocols/protocol-1` — get one protocol by id

**Example workflow:** Trigger → HTTP Request node (GET to one of the URLs above).

## Project Structure

```
/src
  /config      — app config (port, env)
  /data        — hardcoded sites data
  /services    — business logic (sites)
  /controllers — HTTP handlers (delegate to services)
  /routes      — versioned routes (/api/v1)
  /middlewares — error handling
  app.ts       — Express app (routes, middleware)
  server.ts    — bootstrap (listen)
.env.example   — env template (no secrets)
```

## Configuration

Copy `.env.example` to `.env` and adjust if needed. Defaults:

- `PORT=8000`
- `NODE_ENV=development`

**No secrets in Git.** Override via `.env` or environment.

## Assumptions

- All data is hardcoded (no database).
- **No authentication/authorization** — suitable only for trusted/internal use (e.g. internal n8n).

## What Is Intentionally NOT Implemented

- Authentication / authorization
- Role modification or deletion
- Multi-tenant enforcement
- Idempotency keys
- Rate limiting
- Request logging / audit trail

These are planned for a later phase (e.g. Week 2).

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

## Architecture Summary

- **Sites (hardcoded):** Exposes level1/level2 site data via GET; no database; suitable for n8n and internal integrations.
- **No authentication** — Suitable only for trusted/internal use.

- **Evolution:** Add auth, rate limiting, and persistence when needed.
