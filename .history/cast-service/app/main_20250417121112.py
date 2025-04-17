import os

from fastapi import FastAPI, Depends
from fastapi_keycloak import FastAPIKeycloak, OIDCUser

from app.api.casts import casts
from app.api.db import metadata, database, engine
from app.config import (
    KEYCLOAK_SERVER_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET,
    KEYCLOAK_ADMIN_CLIENT_ID, KEYCLOAK_ADMIN_CLIENT_SECRET,
    KEYCLOAK_REALM, KEYCLOAK_CALLBACK_URI
)

metadata.create_all(engine)

app = FastAPI(openapi_url="/api/v1/casts/openapi.json", docs_url="/api/v1/casts/docs")


idp = FastAPIKeycloak(
    server_url=KEYCLOAK_SERVER_URL,
    client_id=KEYCLOAK_CLIENT_ID,
    client_secret=KEYCLOAK_CLIENT_SECRET,  # Clients -> FastAPIClient -> Credentials tab -> Client Secret
    admin_client_id=KEYCLOAK_ADMIN_CLIENT_ID,
    admin_client_secret=KEYCLOAK_ADMIN_CLIENT_SECRET,  # Clients -> admin-cli -> Credentials tab -> Client Secret
    realm=KEYCLOAK_REALM,
    callback_uri=KEYCLOAK_CALLBACK_URI
)
idp.add_swagger_config(app)


@app.get("/admin")
def admin(user: OIDCUser = Depends(idp.get_current_user(required_roles=["admin_user"]))):
# def admin(user: OIDCUser = Depends(idp.get_current_user())):
    from icecream import ic

    ic(user)
    return f'CAST SERVICE, Hi premium user {user}'


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(casts, prefix='/api/v1/casts', tags=['casts'])