# n8n Docker Run Setup - Connecting to REST API

## 🎯 For n8n Team Using `docker run`

Since you're using `docker run` instead of `docker-compose`, here's the updated command to connect to the REST API.

---

## 📋 Current n8n Setup (What You Have Now)

```bash
docker volume create n8n_data

docker run -it --rm \
 --name n8n \
 -p 5678:5678 \
 -e GENERIC_TIMEZONE="<YOUR_TIMEZONE>" \
 -e TZ="<YOUR_TIMEZONE>" \
 -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
 -e N8N_RUNNERS_ENABLED=true \
 -v n8n_data:/home/node/.n8n \
 docker.n8n.io/n8nio/n8n
```

---

## ✅ Updated Command (Connect to REST API)

**Just add `--network reportheld-network` to your existing command:**

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

**What changed:**

- ✅ Added: `--network reportheld-network`
- ✅ Updated timezone to `Asia/Manila` (adjust if needed)

---

## 🚀 Complete Setup Steps

### Step 1: Stop Current n8n (If Running)

```bash
docker stop n8n
```

### Step 2: Verify Network Exists

```bash
docker network ls
```

If `reportheld-network` doesn't exist, create it:

```bash
docker network create reportheld-network
```

### Step 3: Start n8n with Network

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

### Step 4: Verify Connection

Open a new terminal and test:

```bash
docker exec -it n8n wget -O- http://api:8000/health
```

**Expected response:**

```json
{ "status": "ok" }
```

---

## 🧪 Create Test Workflow in n8n

1. **Open n8n:** `http://localhost:5678`
2. **Create new workflow**
3. **Add nodes:**
   - Manual Trigger
   - Set (with test data)
   - HTTP Request

4. **HTTP Request Node Settings:**
   - **Method:** `POST`
   - **URL:** `http://api:8000/api/v1/users`
   - **Authentication:** None
   - **Body Content Type:** JSON
   - **JSON Body:**

   ```json
   {
     "name": "{{ $json.name }}",
     "email": "{{ $json.email }}",
     "role": "{{ $json.role }}"
   }
   ```

5. **Execute and verify!**

---

## 🔄 Run n8n in Background (Optional)

If you want n8n to run in the background instead of interactive mode:

```bash
docker run -d \
 --name n8n \
 --restart unless-stopped \
 -p 5678:5678 \
 --network reportheld-network \
 -e GENERIC_TIMEZONE="Asia/Manila" \
 -e TZ="Asia/Manila" \
 -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
 -e N8N_RUNNERS_ENABLED=true \
 -v n8n_data:/home/node/.n8n \
 docker.n8n.io/n8nio/n8n
```

**Changes:**

- `-it --rm` → `-d` (detached mode)
- Added `--restart unless-stopped` (auto-restart)

**View logs:**

```bash
docker logs n8n -f
```

**Stop n8n:**

```bash
docker stop n8n
docker rm n8n
```

---

## 📊 Network Diagram

```
┌─────────────────────────────────────────┐
│   Office Machine (Docker Desktop)      │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  reportheld-network              │  │
│  │                                  │  │
│  │  ┌─────────┐      ┌──────────┐  │  │
│  │  │   n8n   │─────▶│   API    │  │  │
│  │  │  :5678  │      │  :8000   │  │  │
│  │  └─────────┘      └────┬─────┘  │  │
│  │                        │         │  │
│  │                   ┌────▼─────┐   │  │
│  │                   │  MongoDB │   │  │
│  │                   │  :27017  │   │  │
│  │                   └──────────┘   │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

- [ ] Network created: `docker network ls`
- [ ] n8n running with network: `docker ps`
- [ ] Can access API health: `docker exec -it n8n wget -O- http://api:8000/health`
- [ ] n8n accessible: `http://localhost:5678`
- [ ] Test workflow created
- [ ] Successfully created user via API

---

## 🚨 Troubleshooting

### Issue: "Could not resolve host: api"

**Solution:** Verify n8n is on the network:

```bash
docker network inspect reportheld-network
```

Should see `n8n` container listed.

### Issue: Network doesn't exist

**Solution:**

```bash
docker network create reportheld-network
```

### Issue: Port 5678 already in use

**Solution:** Stop existing n8n:

```bash
docker stop n8n
docker rm n8n
```

---

## 📝 Important URLs

**For n8n Workflows:**

- API Endpoint: `http://api:8000/api/v1/users`
- Health Check: `http://api:8000/health`

**For Browser:**

- n8n UI: `http://localhost:5678`
- API: `http://localhost:8000`

---

## 💡 Quick Reference

**Start n8n (interactive):**

```bash
docker run -it --rm --name n8n -p 5678:5678 --network reportheld-network -e GENERIC_TIMEZONE="Asia/Manila" -e TZ="Asia/Manila" -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true -e N8N_RUNNERS_ENABLED=true -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
```

**Start n8n (background):**

```bash
docker run -d --name n8n --restart unless-stopped -p 5678:5678 --network reportheld-network -e GENERIC_TIMEZONE="Asia/Manila" -e TZ="Asia/Manila" -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true -e N8N_RUNNERS_ENABLED=true -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
```

**Test connection:**

```bash
docker exec -it n8n wget -O- http://api:8000/health
```
