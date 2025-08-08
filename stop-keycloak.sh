#!/bin/bash

# Script to stop Keycloak services
echo "🛑 Stopping Keycloak services..."

# Stop the services
docker-compose -f docker-compose.loc.keycloak.yml down

echo "✅ Keycloak services stopped!"
