#!/bin/bash

echo "🔍 Testing Keycloak Authentication..."

# Test direct port access
echo "1. Testing direct port access..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:7070

# Test admin console access
echo -e "\n2. Testing admin console access..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:7070/admin/

# Check Keycloak logs for errors
echo -e "\n3. Recent Keycloak logs (last 10 lines):"
docker logs --tail 10 microservice-fastapi-keycloak-1

echo -e "\n✅ Test completed!"
echo "💡 If you still experience hanging after login, try:"
echo "   - Clear browser cache and cookies"
echo "   - Try incognito/private browsing mode"
echo "   - Check browser developer tools for network errors"
echo "   - Restart Keycloak: ./stop-keycloak.sh && ./start-keycloak.sh"
