# Keycloak Setup Instructions

## 🚀 Quick Start

### Option 1: Start All Services
```bash
./start-all.sh
```

### Option 2: Start Only Keycloak
```bash
./start-keycloak.sh
```

### Option 3: Manual Setup
```bash
# Start Keycloak services
docker-compose -f docker-compose.loc.keycloak.yml up -d
```

## 🔐 Access Keycloak

### Direct Port Access (Recommended)
- **URL**: http://localhost:7070/admin/
- **Login**: admin / admin

## 🛑 Stop Services

### Stop All Services
```bash
docker-compose -f docker-compose.loc.yml down
docker-compose -f docker-compose.loc.keycloak.yml down
```

### Stop Only Keycloak
```bash
./stop-keycloak.sh
```

## 📋 Available Scripts

- `start-all.sh` - Start all services (main services, Keycloak)
- `start-keycloak.sh` - Start only Keycloak
- `stop-keycloak.sh` - Stop Keycloak services
- `test-keycloak-auth.sh` - Test Keycloak authentication

## 🔧 Troubleshooting

### If Keycloak doesn't start:
```bash
# Check container status
docker ps | grep keycloak

# Check logs
docker logs microservice-fastapi-keycloak-1
```

### If authentication hangs after login:

**Problem**: After entering credentials, the page hangs and doesn't redirect properly.

**Solutions**:

1. **Clear browser cache and cookies**:
   - Clear all browser data for localhost:7070
   - Try incognito/private browsing mode

2. **Check browser developer tools**:
   - Open F12 → Network tab
   - Look for failed requests or timeouts
   - Check Console for JavaScript errors

3. **Test connectivity**:
   ```bash
   ./test-keycloak-auth.sh
   ```

4. **Restart services**:
   ```bash
   ./stop-keycloak.sh
   ./start-keycloak.sh
   ```

5. **Check Keycloak logs**:
   ```bash
   docker logs microservice-fastapi-keycloak-1
   ```

6. **Alternative: Use different browser**:
   - Try Chrome, Firefox, or Safari
   - Disable browser extensions temporarily

## 📝 Notes

- Keycloak is configured for direct port access only (no nginx-proxy)
- This simplifies the setup and avoids proxy-related issues
- Access Keycloak at: http://localhost:7070/admin/
- Login credentials: admin / admin
