import os

from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi_keycloak import OIDCUser
from jose import ExpiredSignatureError

from app.api.casts import casts
from app.api.db import metadata, database, engine
from app.auth.keycloak import idp

metadata.create_all(engine)

app = FastAPI(openapi_url="/api/v1/casts/openapi.json", docs_url="/api/v1/casts/docs")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://microservice-app.dj", 
        "http://microservice-app.ng",
        "https://microservice-app.ng",
        "http://localhost:3000", 
        "http://localhost:8080",
        "http://microservice-app.ng:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(ExpiredSignatureError)
async def expired_signature_handler(request, exc):
    return Response(
        status_code=401,
        content='{"detail": "Token has expired"}',
        media_type="application/json"
    )

idp.add_swagger_config(app)

@app.get("/admin")
def admin(user: OIDCUser = Depends(idp.get_current_user(required_roles=["admin_user"]))):
    from icecream import ic
    ic(user)
    return f'CAST SERVICE, Hi premium user {user}'

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "cast-service"}

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(casts, prefix='/api/v1/casts', tags=['casts'])