# Quick Reference - Commands & Testing

## 🐳 Docker Commands

```bash
# Start API
docker-compose up --build

# Start in background
docker-compose up -d

# Stop API
docker-compose down

# Restart API only
docker-compose restart api

# View logs
docker logs mock-rest-api-api-1 -f

# Check running containers
docker ps
```

---

## 🧪 cURL Commands

### Health Check

```bash
curl http://localhost:8000/health
```

### Create User

```bash
curl -X POST http://localhost:8000/api/v1/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"SecurePass123\",\"role\":\"admin\",\"department\":\"IT\"}"
```

### View Database

```bash
docker exec -it mock-rest-api-mongo-1 mongosh reportheld --eval "db.users.find().pretty()"
```

---

## 📮 Postman Setup

**URL:** `http://localhost:8000/api/v1/users`  
**Method:** `POST`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "MyPassword123",
  "role": "inspector",
  "department": "Operations"
}
```

**Expected Response (201):**

```json
{
  "id": "674a1b2c3d4e5f6789012345",
  "message": "User created successfully"
}
```

---

## ⚡ Quick Test Flow

1. Start API: `docker-compose up -d`
2. Test health: `curl http://localhost:8000/health`
3. Create user: Use Postman or curl command above
4. Check database: `docker exec -it mock-rest-api-mongo-1 mongosh reportheld --eval "db.users.find().pretty()"`

---

## 🔧 Network Commands (for n8n)

```bash
# Create network
docker network create reportheld-network

# Verify network
docker network ls

# Check containers on network
docker network inspect reportheld-network
```
