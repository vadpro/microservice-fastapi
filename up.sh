# bash
source .env.loc
echo "Start Keycloak..."
docker compose -f docker-compose.loc.keycloak.yml up -d
sleep 10s
echo "Start Project..."
docker compose -f docker-compose.loc.yml up