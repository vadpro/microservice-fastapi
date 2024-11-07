import os

from fastapi import FastAPI, Depends
from fastapi_keycloak import FastAPIKeycloak, OIDCUser

from app.api.casts import casts
from app.api.db import metadata, database, engine

metadata.create_all(engine)

app = FastAPI(openapi_url="/api/v1/casts/openapi.json", docs_url="/api/v1/casts/docs")


idp = FastAPIKeycloak(
    server_url=os.getenv('KEYCLOAK_SERVER_URL', "http://172.17.0.1:7070"),
    client_id=os.getenv('KEYCLOAK_CLIENT_ID'),
    client_secret=os.getenv('KEYCLOAK_CLIENT_SECRET'),  # Clients -> FastAPIClient -> Credentials tab -> Client Secret
    admin_client_id=os.getenv('KEYCLOAK_ADMIN_CLIENT_ID'),
    admin_client_secret=os.getenv('KEYCLOAK_ADMIN_CLIENT_SECRET'),  # Clients -> admin-cli -> Credentials tab -> Client Secret
    realm=os.getenv('KEYCLOAK_REALM'),
    callback_uri=os.getenv('KEYCLOAK_CALLBACK_URI')
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