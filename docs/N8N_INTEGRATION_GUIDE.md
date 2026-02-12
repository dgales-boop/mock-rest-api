# n8n Integration Guide - Mock REST API

## 🎯 Overview

This REST API provides a **temporary endpoint** for the n8n team to test user creation workflows. Data is currently stored in MongoDB, but will later be routed to the main Reportheld infrastructure.

**Current Setup:** n8n → REST API → MongoDB  
**Future Setup:** n8n → REST API → Reportheld Infrastructure

---

## 🔗 API Endpoint Details

### Base URL

- **Development (Local):** `http://localhost:8000`
- **Production (When Deployed):** `http://[your-server-ip]:8000` or `http://api.yourdomain.com`

### Endpoint: Create User

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/v1/users`
- **Content-Type:** `application/json`

---

## 📋 Request Format

### Required Fields

```json
{
  "name": "string (required)",
  "email": "string (required, valid email format)",
  "role": "string (required)"
}
```

### Example Request

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "inspector"
}
```

### Validation Rules

- ✅ All three fields (`name`, `email`, `role`) are **required**
- ✅ `email` must be a valid email format
- ✅ `email` must be unique (no duplicates)
- ❌ Unknown fields will be **rejected**

---

## ✅ Success Response

**Status Code:** `201 Created`

```json
{
  "id": "674a1b2c3d4e5f6789012345",
  "message": "User created successfully"
}
```

The `id` is the MongoDB ObjectId of the created user.

---

## ❌ Error Responses

### 400 Bad Request - Missing Required Field

```json
{
  "errors": [
    {
      "field": "role",
      "message": "role is required"
    }
  ]
}
```

### 400 Bad Request - Invalid Email

```json
{
  "errors": [
    {
      "field": "email",
      "message": "email must be a valid email"
    }
  ]
}
```

### 400 Bad Request - Unknown Fields

```json
{
  "error": "Unknown fields: age, department"
}
```

### 409 Conflict - Duplicate Email

```json
{
  "error": "A user with this email already exists"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## 🔧 n8n Workflow Setup

### Option 1: Webhook → HTTP Request (Recommended)

**Step 1: Webhook Node**

- Trigger your workflow with a webhook
- Receives: `name`, `email`, `role`

**Step 2: HTTP Request Node**

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/v1/users`
  - If n8n runs in Docker with this API: `http://api:8000/api/v1/users`
- **Authentication:** None (for now)
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

**Step 3: IF Node (Optional - Error Handling)**

- Check if response status is `201`
- Success path: Continue workflow
- Error path: Send notification/log error

---

### Option 2: Manual Trigger → Set Node → HTTP Request

**Step 1: Manual Trigger**

- Start workflow manually for testing

**Step 2: Set Node**

- Set test data:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "role": "admin"
}
```

**Step 3: HTTP Request Node**

- Same configuration as Option 1

---

## 🐳 Docker Networking (Important!)

### If n8n Runs in Docker

**Option A: Same Docker Network**

1. Add n8n to the same network as this API:

```yaml
# In your n8n docker-compose.yml
networks:
  - mock-rest-api_app-network

networks:
  mock-rest-api_app-network:
    external: true
```

2. Use service name in URL:

```
http://api:8000/api/v1/users
```

**Option B: Host Network**

- Use `http://host.docker.internal:8000/api/v1/users` (Windows/Mac)
- Use `http://172.17.0.1:8000/api/v1/users` (Linux)

**Option C: External Access**

- Use `http://[your-machine-ip]:8000/api/v1/users`

---

## 🧪 Testing the Integration

### 1. Test with cURL First

```bash
curl -X POST http://localhost:8000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","role":"admin"}'
```

### 2. Test in n8n

- Create a simple workflow with Manual Trigger → HTTP Request
- Execute and verify response

### 3. Check Database

```bash
docker exec -it mock-rest-api-mongo-1 mongosh reportheld --eval "db.users.find().pretty()"
```

---

## 📊 Sample n8n Workflow JSON

```json
{
  "nodes": [
    {
      "parameters": {},
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "name",
              "value": "John Doe"
            },
            {
              "name": "email",
              "value": "john.doe@example.com"
            },
            {
              "name": "role",
              "value": "inspector"
            }
          ]
        }
      },
      "name": "Set Test Data",
      "type": "n8n-nodes-base.set",
      "position": [450, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "http://api:8000/api/v1/users",
        "options": {},
        "bodyParametersJson": "={{ JSON.stringify({ name: $json.name, email: $json.email, role: $json.role }) }}"
      },
      "name": "Create User",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{ "node": "Set Test Data", "type": "main", "index": 0 }]]
    },
    "Set Test Data": {
      "main": [[{ "node": "Create User", "type": "main", "index": 0 }]]
    }
  }
}
```

---

## 🔄 Migration Path (Future)

When integrating with Reportheld infrastructure:

1. **API stays the same** - n8n team doesn't need to change anything
2. **Backend changes** - We'll modify the service layer to send to Reportheld instead of MongoDB
3. **Validation stays** - Same field requirements
4. **Response format stays** - Same success/error responses

**n8n team won't need to update their workflows!**

---

## 🚨 Current Limitations

- ❌ No authentication (add in Week 2)
- ❌ No rate limiting
- ❌ No idempotency keys
- ❌ No audit logging
- ⚠️ MongoDB is temporary storage

---

## 📞 Support & Questions

**API Status:** Check health endpoint

```bash
curl http://localhost:8000/health
```

**View All Users:** (For debugging)

```bash
docker exec -it mock-rest-api-mongo-1 mongosh reportheld --eval "db.users.find().pretty()"
```

**Clear Test Data:** (Reset database)

```bash
docker exec -it mock-rest-api-mongo-1 mongosh reportheld --eval "db.users.deleteMany({})"
```

---

## ✅ Quick Checklist for n8n Team

- [ ] API is running (`docker-compose up --build`)
- [ ] Health check works (`http://localhost:8000/health`)
- [ ] Network connectivity configured (if using Docker)
- [ ] Test workflow created in n8n
- [ ] Successful test request completed
- [ ] Error handling implemented in workflow
- [ ] Ready for production testing
