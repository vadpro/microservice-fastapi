from fastapi_keycloak import FastAPIKeycloak
from app.config import (
    KEYCLOAK_SERVER_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET,
    KEYCLOAK_ADMIN_CLIENT_ID, KEYCLOAK_ADMIN_CLIENT_SECRET,
    KEYCLOAK_REALM, KEYCLOAK_CALLBACK_URI
)

idp = FastAPIKeycloak(
    server_url=KEYCLOAK_SERVER_URL,
    client_id=KEYCLOAK_CLIENT_ID,
    client_secret=KEYCLOAK_CLIENT_SECRET,
    admin_client_id=KEYCLOAK_ADMIN_CLIENT_ID,
    admin_client_secret=KEYCLOAK_ADMIN_CLIENT_SECRET,
    realm=KEYCLOAK_REALM,
    callback_uri=KEYCLOAK_CALLBACK_URI
) 