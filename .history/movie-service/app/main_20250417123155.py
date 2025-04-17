import os

from fastapi import FastAPI, Depends, HTTPException, Response
from app.api.movies import movies
from app.api.db import metadata, database, engine
from fastapi_keycloak import OIDCUser
from jose import ExpiredSignatureError
from icecream import ic

from app.utils_helper import prn
from app.auth.keycloak import idp

metadata.create_all(engine)

app = FastAPI(openapi_url="/api/v1/movies/openapi.json", docs_url="/api/v1/movies/docs")

@app.exception_handler(ExpiredSignatureError)
async def expired_signature_handler(request, exc):
    return Response(
        status_code=401,
        content='{"detail": "Token has expired"}',
        media_type="application/json"
    )

idp.add_swagger_config(app)


# dependency injection
@app.get("/admin")
# def admin(user):
def admin(user: OIDCUser = Depends(idp.get_current_user(required_roles=["admin_user"]))):
    prn(user)
    #
    # user2 = Depends(idp.get_current_user())
    # prn(user2)
    # user = idp.get_current_user(required_roles=["admin_user"])
    #
    # OIDCUser = Depends(user)
    # prn(OIDCUser)

    ic(user)
    return f'MOVIE SERVICE, Hi premium user {user}'


@app.get("/user/roles")
def user_roles(user: OIDCUser = Depends(idp.get_current_user())):
    return f'{user.roles}'


@app.get("/login-link", tags=["auth-flow"])
def login_redirect():
    return idp.login_uri


@app.get("/callback", tags=["auth-flow"])
def callback(session_state: str, code: str):
    return idp.exchange_authorization_code(session_state=session_state, code=code)


@app.get("/logout-link", tags=["auth-flow"])
def logout():
    return idp.logout_uri


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


app.include_router(movies, prefix='/api/v1/movies', tags=['movies'])
