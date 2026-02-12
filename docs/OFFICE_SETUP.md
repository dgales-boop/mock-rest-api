# Office Environment Setup Guide

## 🏢 Will This Work at the Office?

**Short answer:** Yes, but you may need to configure Docker to work with your office's SSH/proxy setup.

---

## 🔧 Common Office Environment Issues

### Issue 1: Docker Behind Corporate Proxy/SSH

If your office uses SSH tunneling or a corporate proxy, Docker might not be able to pull images or connect to networks.

**Symptoms:**

- `docker-compose up --build` hangs or times out
- "Cannot connect to Docker daemon" errors
- Image pull failures

**Solution:** Configure Docker to use your office proxy settings.

---

## ✅ Setup Steps for Office Environment

### 1. Check if Docker Works

```bash
docker --version
docker ps
```

If these work, Docker is installed correctly.

### 2. Test Image Pull

```bash
docker pull mongo:7
```

If this fails, you have a network/proxy issue.

### 3. Configure Docker Proxy (If Needed)

**For Docker Desktop (Windows):**

1. Open Docker Desktop
2. Settings → Resources → Proxies
3. Enable "Manual proxy configuration"
4. Enter your office proxy details (ask IT for these)
5. Apply & Restart

**For Docker CLI:**
Create/edit `~/.docker/config.json`:

```json
{
  "proxies": {
    "default": {
      "httpProxy": "http://proxy.company.com:8080",
      "httpsProxy": "http://proxy.company.com:8080",
      "noProxy": "localhost,127.0.0.1"
    }
  }
}
```

---

## 🚀 Alternative: Pre-built Images

If Docker build fails at the office, you can:

1. **Build locally (at home)** and push to Docker Hub
2. **Pull the pre-built image** at the office

**Steps:**

**At Home:**

```bash
# Build and tag
docker build -t yourusername/mock-rest-api:latest .

# Push to Docker Hub
docker login
docker push yourusername/mock-rest-api:latest
```

**At Office:**
Modify `docker-compose.yml`:

```yaml
services:
  api:
    image: yourusername/mock-rest-api:latest # Use pre-built image
    # Remove build section
    ports:
      - "8000:8000"
    # ... rest of config
```

Then just run:

```bash
docker-compose up
```

---

## 🔍 SSH Conflicts with Docker

**The Issue:**
If your office uses SSH port forwarding (e.g., `-L 8000:localhost:8000`), it might conflict with Docker's port mapping.

**Solutions:**

### Option 1: Use Different Port

Modify `docker-compose.yml`:

```yaml
services:
  api:
    ports:
      - "8001:8000" # Map to different host port
```

Then access: `http://localhost:3001`

### Option 2: Use Docker's Internal Network

If you're running other services (like n8n) in Docker, they can communicate using service names:

```
http://api:8000  # From within Docker network
```

---

## 📋 Pre-Office Checklist

Before going to the office:

- [ ] Test `docker-compose up --build` at home (already working ✅)
- [ ] Ask IT about proxy settings
- [ ] Ask IT if Docker is allowed/supported
- [ ] Consider pushing pre-built images to Docker Hub
- [ ] Have this guide ready for troubleshooting

---

## 🆘 If Docker Doesn't Work at Office

**Plan B: Run Without Docker**

1. **Install MongoDB locally:**
   - Download MongoDB Community Server
   - Or use MongoDB Atlas (cloud, free tier)

2. **Run the API locally:**

```bash
npm install
npm run build
npm start
```

3. **Update `.env`:**

```
MONGO_URI=mongodb://localhost:27017/reportheld
# Or use MongoDB Atlas connection string
PORT=8000
```

---

## 💡 Quick Diagnosis Commands

Run these at the office to diagnose issues:

```bash
# Check Docker is running
docker --version
docker ps

# Check network connectivity
docker pull hello-world

# Check if ports are available
netstat -an | findstr "8000"
netstat -an | findstr "27017"

# View Docker logs
docker-compose logs
```

---

## 🎯 Most Likely Scenario

**At the office, you'll probably need to:**

1. Configure Docker proxy settings (ask IT)
2. OR use a different port if 8000 is taken by SSH forwarding
3. Everything else should work the same

**The SSH setup won't prevent Docker from working** - they can coexist. You just might need proxy configuration.
