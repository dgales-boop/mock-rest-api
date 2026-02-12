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

## Endpoints

| Method | Path                     | Description                              |
| ------ | ------------------------ | ---------------------------------------- |
| GET    | `/health`                | Liveness/readiness                       |
| GET    | `/api/v1/sites`          | List all sites (level1 + level2, hardcoded) |
| GET    | `/api/v1/sites/:id`      | Get one site (level1) by ID, e.g. `site-1` |
| GET    | `/api/v1/sites/level2/:id` | Get one level2 item by ID, e.g. `BT-123450L` |

### GET /api/v1/sites (hardcoded)

Returns all level1 sites with nested level2. No database required.

- **GET /api/v1/sites** — full JSON `{ "level1": [ ... ] }`
- **GET /api/v1/sites/site-1** — single site by level1 id (404 if not found)
- **GET /api/v1/sites/level2/BT-123450L** — single level2 item by id (404 if not found)

## cURL Examples

**Health check:**

```bash
curl http://localhost:8000/health
```

**List all sites (hardcoded):**

```bash
curl http://localhost:8000/api/v1/sites
```

**Get site by ID:**

```bash
curl http://localhost:8000/api/v1/sites/site-1
```

**Get level2 item by ID:**

```bash
curl http://localhost:8000/api/v1/sites/level2/BT-123450L
```

## What n8n needs to do to connect and use this API

With the API running locally (`npm run dev`), n8n on the same machine can call:

- **GET** `http://localhost:8000/api/v1/sites` — list all sites (hardcoded)
- **GET** `http://localhost:8000/api/v1/sites/site-1` — get one site by id
- **GET** `http://localhost:8000/api/v1/sites/level2/BT-123450L` — get one level2 item by id

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
