# Deploy to Render

This guide gets the mock-rest-api running on [Render](https://render.com) so your endpoints are publicly usable (e.g. for n8n or Postman).

## Prerequisites

- Code in a **Git repository** (GitHub or GitLab). If it’s only on your machine, push it to GitHub first.
- A **Render account** (free tier is enough): [https://dashboard.render.com/register](https://dashboard.render.com/register).

## Steps

### 1. Push your code to GitHub

If you haven’t already:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

(Use your real repo URL and branch name, e.g. `main` or `master`.)

### 2. Create a Web Service on Render

1. Go to [https://dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **New +** → **Web Service**.
3. **Connect** your GitHub/GitLab account if asked, then select the **repository** that contains this project.
4. Click **Connect** (or **Next**).

### 3. Configure the service

Use these settings:

| Field | Value |
|-------|--------|
| **Name** | `mock-rest-api` (or any name you like) |
| **Region** | Choose one close to you |
| **Branch** | `main` (or your default branch) |
| **Runtime** | **Node** |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** (or paid if you prefer) |

**Environment variables (optional):**

- The app works with no env vars (hardcoded data, `PORT` is set by Render).
- You can add:
  - **NODE_ENV** = `production` (Render often sets this for you).
  - **API_KEY** = a secret string — if set, all `/api/v1/*` requests must send this key via `X-API-Key` or `Authorization: Bearer <key>`.

Do **not** add a **PORT** variable — Render assigns it automatically and the app already uses `process.env.PORT`.

### 4. Deploy

1. Click **Create Web Service**.
2. Render will clone the repo, run the build command, then the start command. The first deploy can take a few minutes.
3. When the deploy succeeds, the **log** will show something like: `API listening on port 10000` (or whatever port Render assigned).
4. Your base URL will be: **`https://<your-service-name>.onrender.com`**  
   (e.g. `https://mock-rest-api.onrender.com` if the service name is `mock-rest-api`).

### 5. Test the endpoints

Replace `https://YOUR-SERVICE-NAME.onrender.com` with your actual URL:

- **Health:**  
  `GET https://YOUR-SERVICE-NAME.onrender.com/health`
- **All sites:**  
  `GET https://YOUR-SERVICE-NAME.onrender.com/api/v1/sites`
- **One site:**  
  `GET https://YOUR-SERVICE-NAME.onrender.com/api/v1/sites/site-l1`
- **One level2:**  
  `GET https://YOUR-SERVICE-NAME.onrender.com/api/v1/sites/level2/bt-1234`

In Postman: create a new request, set method to **GET**, paste one of the URLs above, and click **Send**. The response body will show the JSON.

## Free tier notes

- The service may **spin down** after ~15 minutes of no traffic. The first request after that can take 30–60 seconds (cold start).
- Free tier has **limited hours per month**. For always-on or heavier use, switch to a paid plan.

## Troubleshooting

- **Build failed**  
  Check the **Logs** tab on Render. Common fixes:
  - `npm run build` must succeed locally (`npm run build` in the project root).
  - Node version: the app expects Node ≥18; Render’s Node runtime is usually fine. You can set **Environment** → **NODE_VERSION** = `20` if needed.

- **Application failed to respond**  
  - Ensure **Start Command** is exactly `npm start` (no `node dist/server.js` unless you’re sure the path is correct).
  - The app must listen on `process.env.PORT`; it already does in `src/config/index.ts`.

- **404 on /api/v1/sites**  
  - Use the full path: `/api/v1/sites` (with the leading slash).
  - No trailing slash: `.../sites` not `.../sites/`.

## Optional: deploy with Blueprint (render.yaml)

If your repo has a `render.yaml` in the root (this project does), you can use **Blueprint**:

1. In the Render dashboard: **New +** → **Blueprint**.
2. Connect the same repo.
3. Render will read `render.yaml` and create the Web Service with the build/start commands from the file. Confirm and deploy.

You can still change the service name or region in the dashboard after it’s created.
