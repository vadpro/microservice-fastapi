#!/bin/bash

# Script to start all services with direct port access
echo "🚀 Starting all microservices..."

# Start main services
echo "📦 Starting main services..."
docker-compose -f docker-compose.loc.yml up -d

# Start Keycloak
echo "🔐 Starting Keycloak..."
./start-keycloak.sh

echo -e "\n🎉 All services are ready!"
echo "📋 Available services:"
echo "  🌐 Frontend: http://movie.ng"
echo "  🔌 API Cast: http://api-cast.dj"
echo "  🎬 API Movie: http://api-movie.dj"
echo "  🔐 Keycloak: http://localhost:7070/admin/"
echo "  👤 Keycloak login: admin / admin"
