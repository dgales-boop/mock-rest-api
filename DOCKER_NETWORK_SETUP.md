# Docker Network Setup Guide - REST API & n8n Integration

## 🎯 Overview

This guide shows how to connect the REST API and n8n using a **shared Docker network**. Both services will run on the **same machine at the office** using Docker Desktop.

**Setup:** Both services → Same Docker network → Direct communication

---

## 📋 Prerequisites

- ✅ Docker Desktop installed and running
- ✅ Both REST API and n8n will run on the **same office machine**
- ✅ Both teams have access to the same machine

---

## 🔧 Part 1: REST API Team Setup (You)

### Step 1: Stop Current Containers

```bash
docker-compose down
```

### Step 2: Create Shared Network

**Only needs to be done ONCE at the office:**

```bash
docker network create reportheld-network
```

**Verify it was created:**

```bash
docker network ls
```

You should see `reportheld-network` in the list.

### Step 3: Update docker-compose.yml

Open `docker-compose.yml` and modify it:

**Before:**

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - PORT=8000
      - MONGO_URI=mongodb://mongo:27017/reportheld
    depends_on:
      mongo:
        condition: service_healthy
    networks:
      - app-network

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 5s
      timeout: 5s
      retries: 5
      start_period: 10s
    networks:
      - app-network

volumes:
  mongo-data:

networks:
  app-network:
    driver: bridge
```

**After:**

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - PORT=8000
      - MONGO_URI=mongodb://mongo:27017/reportheld
    depends_on:
      mongo:
        condition: service_healthy
    networks:
      - reportheld-network # Changed

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 5s
      timeout: 5s
      retries: 5
      start_period: 10s
    networks:
      - reportheld-network # Changed

volumes:
  mongo-data:

networks:
  reportheld-network: # Changed
    external: true # Changed - uses existing network
```

### Step 4: Start Containers

```bash
docker-compose up --build
```

### Step 5: Verify API is Running

```bash
curl http://localhost:8000/health
```

**Expected response:**

```json
{ "status": "ok" }
```

### Step 6: Find API Container Name

```bash
docker ps
```

Look for the API container name (e.g., `mock-rest-api-api-1`)

### Step 7: Verify Network Connection

```bash
docker network inspect reportheld-network
```

You should see your `api` and `mongo` containers listed.

---

## 🔧 Part 2: n8n Team Setup

### Step 1: Verify Network Exists

**The n8n team should check if the network exists:**

```bash
docker network ls
```

They should see `reportheld-network` (created by REST API team).

**If it doesn't exist, create it:**

```bash
docker network create reportheld-network
```

### Step 2: Update n8n docker-compose.yml

**If n8n team uses docker-compose:**

Add the network to their existing `docker-compose.yml`:

```yaml
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=admin
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - reportheld-network # Add this

volumes:
  n8n_data:

networks:
  reportheld-network: # Add this
    external: true # Add this
```

### Step 3: Start n8n

```bash
docker-compose up -d
```

### Step 4: Verify n8n is on the Network

```bash
docker network inspect reportheld-network
```

Should see both `api`, `mongo`, and `n8n` containers.

### Step 5: Test Connection from n8n Container

```bash
docker exec -it <n8n-container-name> wget -O- http://api:8000/health
```

**Expected response:**

```json
{ "status": "ok" }
```

---

## 🧪 Part 3: Testing the Integration

### n8n Team: Create Test Workflow

1. **Open n8n:** `http://localhost:5678`
2. **Create new workflow**
3. **Add Manual Trigger node**
4. **Add Set node** with test data:
   - `name`: "Test User"
   - `email`: "test@example.com"
   - `role`: "admin"
5. **Add HTTP Request node:**
   - **Method:** `POST`
   - **URL:** `http://api:8000/api/v1/users`
   - **Body Content Type:** JSON
   - **JSON Body:**
   ```json
   {
     "name": "{{ $json.name }}",
     "email": "{{ $json.email }}",
     "role": "{{ $json.role }}"
   }
   ```
6. **Execute workflow**

### REST API Team: Verify Data

```bash
docker exec -it mock-rest-api-mongo-1 mongosh reportheld --eval "db.users.find().pretty()"
```

Should see the user created by n8n!

---

## 🔄 Workflow Summary

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

## 📝 Important URLs

### For n8n Team:

- **API Endpoint:** `http://api:8000/api/v1/users`
- **Health Check:** `http://api:8000/health`

### For REST API Team:

- **API (localhost):** `http://localhost:8000`
- **n8n (localhost):** `http://localhost:5678`

---

## 🚨 Troubleshooting

### Issue: "Could not resolve host: api"

**Solution:** Verify both containers are on the same network:

```bash
docker network inspect reportheld-network
```

### Issue: "Connection refused"

**Solution:** Check if API is running:

```bash
docker ps
curl http://localhost:8000/health
```

### Issue: Network doesn't exist

**Solution:** Create it:

```bash
docker network create reportheld-network
```

### Issue: Containers not on network

**Solution:** Restart containers:

```bash
docker-compose down
docker-compose up --build
```

---

## ✅ Verification Checklist

### REST API Team:

- [ ] Network created: `docker network ls`
- [ ] `docker-compose.yml` updated
- [ ] Containers running: `docker ps`
- [ ] Health check works: `curl http://localhost:8000/health`
- [ ] Containers on network: `docker network inspect reportheld-network`

### n8n Team:

- [ ] Network exists: `docker network ls`
- [ ] `docker-compose.yml` updated
- [ ] n8n running: `docker ps`
- [ ] Can access API: `docker exec -it <n8n-container> wget -O- http://api:8000/health`
- [ ] Test workflow created and executed
- [ ] Data appears in MongoDB

---

## 🔄 When Moving to Office

**Both teams at the office:**

1. **First time setup:**
   - Create network: `docker network create reportheld-network`
   - Both teams update their `docker-compose.yml`
   - Start containers

2. **Daily use:**
   - Just run `docker-compose up`
   - Network persists between restarts

3. **No changes needed:**
   - Same setup works on any machine
   - No IP addresses to configure
   - No firewall rules needed

---

## 📞 Support

**Check API status:**

```bash
curl http://localhost:8000/health
```

**View API logs:**

```bash
docker logs mock-rest-api-api-1 -f
```

**View n8n logs:**

```bash
docker logs <n8n-container-name> -f
```

**List all networks:**

```bash
docker network ls
```

**Inspect network:**

```bash
docker network inspect reportheld-network
```
