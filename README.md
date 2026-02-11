# Reportheld API – Feasibility Prototype

Minimal self-hosted REST API for exposing Reportheld domain capabilities to n8n, AI tooling, and internal integrations. **Week 1 proof-of-concept** — not a full Reportheld API.

## Quick Start (≈30 min handover)

**Prerequisites:** Docker and Docker Compose installed. No local Node or MongoDB required.

```bash
# Clone (or unpack) the project, then:
docker-compose up --build
```

- API: **http://localhost:3000**
- Health: **http://localhost:3000/health**
- MongoDB runs only inside Docker; no local MongoDB install.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness/readiness |
| POST | `/api/v1/users` | Create user (n8n webhook target) |

### POST /api/v1/users

**Request (JSON):**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "inspector"
}
```

**Validation:**

- `name`, `email`, `role` — required
- `email` — valid email format
- Only these three fields allowed; unknown fields are rejected

**Success (201):**

```json
{
  "id": "674a1b2c3d4e5f6789012345",
  "message": "User created successfully"
}
```

**Errors:**

- **400** — Validation failed (missing/invalid fields or unknown fields)
- **409** — Duplicate email (unique index on `email`)
- **500** — Internal error

## cURL Examples

**Create user:**

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","role":"inspector"}'
```

**Health check:**

```bash
curl http://localhost:3000/health
```

**Validation error (missing field):**

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com"}'
```

**Duplicate email (second request with same email):**

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","role":"inspector"}'
```

## n8n HTTP Request Node

Use this in an n8n workflow (e.g. after a Webhook node):

- **Method:** POST  
- **URL:** `http://api:3000/api/v1/users` (when n8n runs in same Docker network as this API)  
  - From host machine: `http://localhost:3000/api/v1/users`
- **Body Content Type:** JSON
- **Specify Body:** Using JSON
- **JSON Body:**

```json
{
  "name": "{{ $json.name }}",
  "email": "{{ $json.email }}",
  "role": "{{ $json.role }}"
}
```

If the webhook sends `name`, `email`, and `role` directly, you can pass `$json` (or the relevant subset) as the body. Ensure only `name`, `email`, and `role` are sent; extra fields will be rejected.

## Project Structure

```
/src
  /config      — app config, Mongo connection
  /models      — Mongoose schemas (User)
  /services    — business logic (user creation, duplicate handling)
  /controllers — HTTP handlers (delegate to services)
  /routes      — versioned routes (/api/v1)
  /middlewares — validation, error handling
  app.ts       — Express app (routes, middleware)
  server.ts    — bootstrap (Mongo, listen)
Dockerfile     — multi-stage build
docker-compose.yml — api + mongo, healthcheck, volume
.env.example   — env template (no secrets)
```

## Configuration

Copy `.env.example` to `.env` and adjust if needed. Defaults:

- `MONGO_URI=mongodb://mongo:27017/reportheld` (use service name in Docker)
- `PORT=3000`

**No secrets in Git.** Override via `.env` or environment.

## Assumptions

- Single database (reportheld DB); no multi-tenant isolation in this prototype.
- **No authentication/authorization** — suitable only for trusted/internal use (e.g. internal n8n).
- Role is stored as provided; no role enum or modification in v1.
- MongoDB is the only persistence; no caching or event bus.

## What Is Intentionally NOT Implemented

- Authentication / authorization
- Role modification or deletion
- Multi-tenant enforcement
- Idempotency keys
- Rate limiting
- Request logging / audit trail

These are planned for a later phase (e.g. Week 2).

## Local Development (optional)

```bash
npm install
# Ensure MongoDB is reachable (e.g. docker-compose up mongo only, or use MONGO_URI)
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

## Architecture Summary

- **Why user creation as first capability:** Demonstrates external automation (n8n) creating a domain entity in a controlled way; validates API surface and Docker setup.
- **Why safe for v1:** Single endpoint, strict validation, unique email, no PII beyond what’s needed; designed to add auth and hardening next.
- **Risks (known):** Duplicate submissions (same payload twice → second returns 409); no auth (abuse if exposed); no rate limiting. Mitigation: keep network internal and add auth/rate limiting in Week 2.
- **Evolution (e.g. Week 2):** JWT auth, tenant isolation, idempotency keys, rate limiting, request logging, audit trail.
