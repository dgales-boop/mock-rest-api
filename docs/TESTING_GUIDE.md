# Quick Testing Guide - Postman & MongoDB Compass

## 🧪 Testing in Postman

### 1. Health Check

- **Method:** `GET`
- **URL:** `http://localhost:8000/health`
- **Expected:** `{"status": "ok"}`

### 2. Create User

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/v1/users`
- **Headers:** `Content-Type: application/json`
- **Body (raw → JSON):**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "inspector"
}
```

- **Expected (201):** `{"id": "...", "message": "User created successfully"}`

### 3. Test Duplicate Email (409 Error)

- Use same email again → Should get error

### 4. Test Missing Field (400 Error)

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

## 🗄️ Viewing Data in MongoDB Compass

### Setup (One-time)

1. **Download:** [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. **Install and open**
3. **Connection String:** `mongodb://localhost:27017`
4. **Click "Connect"**

### View Your Data

1. **Left sidebar** → Click `reportheld` database
2. **Click `users` collection**
3. **See all users** in table/JSON view

### Useful Features

- **Documents tab:** View all data
- **Aggregations tab:** Run queries
- **Indexes tab:** See email unique index
- **Refresh button:** Update after Postman tests

---

## 🎯 Quick Test Workflow

1. **Postman:** Create user → Copy the `id` from response
2. **Compass:** Refresh → See new user appear
3. **Postman:** Try duplicate email → Get 409 error
4. **Compass:** User count stays same (duplicate rejected)

---

## 📝 Sample Test Data

```json
{"name": "Alice Johnson", "email": "alice@example.com", "role": "inspector"}
{"name": "Bob Smith", "email": "bob@example.com", "role": "admin"}
{"name": "Carol White", "email": "carol@example.com", "role": "user"}
```

---
