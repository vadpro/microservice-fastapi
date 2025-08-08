# Simplified Keycloak Setup

## 🎯 Overview

This setup provides **direct port access only** for Keycloak, eliminating nginx-proxy complexity and authentication hanging issues.

## 🚀 Quick Start

### Start All Services
```bash
./start-all.sh
```

### Start Only Keycloak
```bash
./start-keycloak.sh
```

### Stop Keycloak
```bash
./stop-keycloak.sh
```

## 🔐 Access Keycloak

- **URL**: http://localhost:7070/admin/
- **Login**: admin / admin

## 📋 Available Scripts

- `start-all.sh` - Start all services (main services + Keycloak)
- `start-keycloak.sh` - Start only Keycloak
- `stop-keycloak.sh` - Stop Keycloak services
- `test-keycloak-auth.sh` - Test Keycloak connectivity

## 🔧 Troubleshooting

### If Keycloak doesn't start:
```bash
# Check container status
docker ps | grep keycloak

# Check logs
docker logs microservice-fastapi-keycloak-1
```

### If authentication hangs:
1. **Clear browser cache** for localhost:7070
2. **Try incognito mode**
3. **Check browser developer tools** (F12 → Network tab)
4. **Restart Keycloak**:
   ```bash
   ./stop-keycloak.sh && ./start-keycloak.sh
   ```

## ✅ Benefits of This Setup

- ✅ **Simplified configuration** - no nginx-proxy complexity
- ✅ **Direct port access** - no proxy-related issues
- ✅ **Reliable authentication** - no hanging after login
- ✅ **Easy troubleshooting** - fewer moving parts
- ✅ **Fast startup** - no external network dependencies

## 📝 Configuration Details

- **Port**: 7070 (mapped to container port 8080)
- **Database**: PostgreSQL with PostGIS
- **Mode**: Development mode (KC_DEV=true)
- **Proxy**: Edge proxy mode for proper forwarding
- **Hostname**: localhost (simplified configuration)

## 🎉 Ready to Use!

Keycloak is now accessible at **http://localhost:7070/admin/** with login credentials **admin/admin**.
