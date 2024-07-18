# bash
echo "Start Keycloak..."
docker compose -f docker-compose.loc.keycloak.yml up -d
sleep 5s
echo "Start Project..."
docker compose -f docker-compose.loc.yml up