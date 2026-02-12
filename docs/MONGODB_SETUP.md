# MongoDB setup guide

You need a running MongoDB instance for the API to connect to. Choose one option below.

---

## Option A: MongoDB Atlas (cloud, free tier)

Good if you don’t want to install MongoDB on your machine.

### 1. Create an account and cluster

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up (or log in).
2. Create a **free** cluster (e.g. M0).
3. Choose a region close to you and create the cluster (takes a minute).

### 2. Allow access and create a user

1. When prompted (or from **Database Access** in the left menu), **add a database user**:
   - Username: e.g. `reportheld`
   - Password: choose a strong password and **save it**.
   - Click **Add User**.

2. In **Network Access** (left menu), **Add IP Address**:
   - For local dev you can add **`0.0.0.0/0`** (allow from anywhere) — only for development.
   - Or add your current IP. Click **Add Entry**, then **Confirm**.

### 3. Get the connection string

1. Go to **Database** (left menu) and click **Connect** on your cluster.
2. Choose **Connect your application**.
3. Copy the connection string. It looks like:
   ```text
   mongodb+srv://reportheld:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace **`<password>`** with your database user password.
5. Add the database name before the `?` so the API uses the `reportheld` database:
   ```text
   mongodb+srv://reportheld:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/reportheld?retryWrites=true&w=majority
   ```

### 4. Use it in the API and Compass

1. In your project, copy `.env.example` to `.env` if you haven’t already.
2. In `.env`, set:
   ```env
   MONGO_URI=mongodb+srv://reportheld:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/reportheld?retryWrites=true&w=majority
   ```
   (Use your real password and cluster URL.)

3. **MongoDB Compass:** Install [Compass](https://www.mongodb.com/products/compass) if you want a GUI. Paste the same connection string and connect. You’ll see the `reportheld` database; the API will create the `users` collection when you POST to `/api/v1/users`.

4. Run the API:
   ```bash
   npm run dev
   ```

---

## Option B: MongoDB Community (local on Windows)

Good if you want MongoDB running only on your PC.

### 1. Install MongoDB Community

1. Download the installer: [MongoDB Community Server](https://www.mongodb.com/try/download/community) (choose Windows, MSI).
2. Run the installer.
3. Choose **Complete**.
4. Optionally install **MongoDB Compass** when the installer offers it (GUI to browse data).
5. At the end, leave **“Install MongoDB as a Service”** checked so it starts automatically. Finish the install.

### 2. Check the service

1. Open **Services** (Win + R → `services.msc` → Enter).
2. Find **MongoDB Server** — status should be **Running**.
3. If it’s not running, right‑click → **Start**.

### 3. Connection string for the API

- Default local connection: **`mongodb://localhost:27017/reportheld`**
- In `.env` you can set:
  ```env
  MONGO_URI=mongodb://localhost:27017/reportheld
  ```
  (Or leave `.env` empty and the app will use this by default.)

### 4. Connect with Compass (optional)

1. Open **MongoDB Compass**.
2. Connection string: **`mongodb://localhost:27017`**
3. Click **Connect**.
4. You’ll see the `reportheld` database after the API has run at least once (e.g. after one successful `POST /api/v1/users`).

### 5. Run the API

```bash
npm run dev
```

The API will connect to `localhost:27017` and use the `reportheld` database.

---

## Quick reference

| Setup           | MONGO_URI in `.env` |
|----------------|----------------------|
| **Atlas**      | `mongodb+srv://user:pass@cluster....mongodb.net/reportheld?retryWrites=true&w=majority` |
| **Local (Windows)** | `mongodb://localhost:27017/reportheld` (or omit and use default) |

- The API uses the **database name** in the URI (e.g. `reportheld`). The `users` collection is created automatically when you create the first user via `POST /api/v1/users`.
- **Compass** is only a viewer: use the same connection string (Atlas or localhost) to see the same data the API uses.
