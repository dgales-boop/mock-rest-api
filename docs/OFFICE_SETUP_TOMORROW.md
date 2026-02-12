# Office Setup Guide - Tomorrow

## 🎯 Quick Setup (Both Teams)

---

## 📋 Part 1: Your Setup (REST API Team)

### Step 1: Create Network (First Time Only)

```bash
docker network create reportheld-network
```

### Step 2: Start API

```bash
cd mock-rest-api
docker-compose up --build
```

### Step 3: Verify API Works

```bash
curl http://localhost:8000/health
```

**Expected:** `{"status": "ok"}`

### Step 4: Check Network

```bash
docker network inspect reportheld-network
```

Should see `api` and `mongo` containers.

---

## 📋 Part 2: n8n Team Setup

### Step 1: Stop Current n8n

```bash
docker stop n8n
```

### Step 2: Start n8n with Network

```bash
docker run -it --rm \
 --name n8n \
 -p 5678:5678 \
 --network reportheld-network \
 -e GENERIC_TIMEZONE="Asia/Manila" \
 -e TZ="Asia/Manila" \
 -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
 -e N8N_RUNNERS_ENABLED=true \
 -v n8n_data:/home/node/.n8n \
 docker.n8n.io/n8nio/n8n
```

**Key change:** Added `--network reportheld-network`

### Step 3: Test Connection

Open new terminal:

```bash
docker exec -it n8n wget -O- http://api:8000/health
```

**Expected:** `{"status":"ok"}`

### Step 4: Create Test Workflow in n8n

1. Open `http://localhost:5678`
2. Add **HTTP Request** node:
   - **Method:** `POST`
   - **URL:** `http://api:8000/api/v1/users`
   - **Body:** JSON
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "role": "admin"
   }
   ```
3. Execute workflow

### Step 5: Verify in Database

```bash
docker exec -it mock-rest-api-mongo-1 mongosh reportheld --eval "db.users.find().pretty()"
```

Should see the user created by n8n!

---

## ✅ Success Checklist

### Your Checklist:

- [ ] Network created
- [ ] API running on port 8000
- [ ] Health check works
- [ ] Containers on network

### n8n Team Checklist:

- [ ] n8n stopped and restarted with network
- [ ] Connection test successful
- [ ] Test workflow created
- [ ] User appears in database

---

## 🔗 Important URLs

**For n8n workflows:** `http://api:8000/api/v1/users`  
**n8n UI:** `http://localhost:5678`  
**API (browser):** `http://localhost:8000`

---

## 🚨 Quick Troubleshooting

**n8n can't connect to API:**

```bash
docker network inspect reportheld-network
```

Both `n8n` and `api` should be listed.

**Port already in use:**

```bash
docker ps
docker stop <container-name>
```

**Start fresh:**

```bash
docker-compose down
docker stop n8n
docker network create reportheld-network
# Then restart both
```
