# API Changes Summary

## ✅ New Fields Added

### Request Format (Updated)

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123",
  "role": "inspector",
  "department": "Operations"
}
```

### Changes Made:

1. ✅ Added `password` field (required, min 8 characters, hashed with bcrypt)
2. ✅ Added `department` field (required)
3. ✅ Password is hashed before storing (never stored in plain text)
4. ✅ Password validation: minimum 8 characters

### Response (Unchanged)

```json
{
  "id": "674a1b2c3d4e5f6789012345",
  "message": "User created successfully"
}
```

**Note:** Password is NEVER returned in responses!

---

## 🧪 Test in Postman

**URL:** `http://localhost:8000/api/v1/users`  
**Method:** `POST`  
**Headers:** `Content-Type: application/json`

**Body:**

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "MyPassword123",
  "role": "admin",
  "department": "IT"
}
```

---

## 📋 For n8n Team

Update your n8n workflows to include the new fields:

```json
{
  "name": "{{ $json.name }}",
  "email": "{{ $json.email }}",
  "password": "{{ $json.password }}",
  "role": "{{ $json.role }}",
  "department": "{{ $json.department }}"
}
```

---

## ⚠️ Breaking Change

**Old requests will now fail!** All requests must include:

- `password` (min 8 chars)
- `department`

Update all existing integrations before deploying!
