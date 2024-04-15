from fastapi import FastAPI, Depends
from app.api.movies import movies
from app.api.db import metadata, database, engine

from fastapi_keycloak import FastAPIKeycloak, OIDCUser


metadata.create_all(engine)

app = FastAPI(openapi_url="/api/v1/movies/openapi.json", docs_url="/api/v1/movies/docs")

idp = FastAPIKeycloak(
    server_url="http://keycloak.loc/auth",
    # server_url="http://keycloak.loc/realms/FastAPIRealm/protocol/openid-connect/auth",
    client_id="FastAPIClient",
    client_secret="OASGV2HuGc1YcRFMJbqvr8vfutthmIdL",
    admin_client_secret="PO8uim2tII5DKU2eQu3Yey08k1HTlZ3G",
    realm="FastAPIRealm",
    callback_uri="http://movie.ng/callback"
)
idp.add_swagger_config(app)

@app.get("/admin")
def admin(user: OIDCUser = Depends(idp.get_current_user(required_roles=["admin"]))):
    return f'Hi premium user {user}'


@app.get("/user/roles")
def user_roles(user: OIDCUser = Depends(idp.get_current_user)):
    return f'{user.roles}'

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


app.include_router(movies, prefix='/api/v1/movies', tags=['movies'])
