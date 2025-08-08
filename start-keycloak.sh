#!/bin/bash

# Script to start Keycloak with direct port access only
echo "🚀 Starting Keycloak services..."

# Start the services
docker-compose -f docker-compose.loc.keycloak.yml up -d

# Wait for Keycloak container to be ready
echo "⏳ Waiting for Keycloak container to start..."
sleep 15

# Test connectivity
echo "🧪 Testing connectivity..."

echo "=== Testing direct port access ==="
curl -I http://localhost:7070 2>/dev/null | head -1

echo -e "\n✅ Keycloak is ready!"
echo "🔌 Direct access: http://localhost:7070/admin/"
echo "👤 Login: admin / admin"
