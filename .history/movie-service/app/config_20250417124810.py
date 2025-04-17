import os

# Настройки для cast-service
CAST_SERVICE_HOST_URL = os.getenv('CAST_SERVICE_HOST_URL', 'http://api-cast.dev/api/v1/casts/')
CAST_SERVICE_WS_URL = os.getenv('CAST_SERVICE_WS_URL', 'ws://cast_service:8000/api/v1/casts/ws/cast-info')

# Настройки для Keycloak
KEYCLOAK_SERVER_URL = os.getenv('KEYCLOAK_SERVER_URL', 'http://keycloak.loc')
KEYCLOAK_CLIENT_ID = os.getenv('KEYCLOAK_CLIENT_ID')
KEYCLOAK_CLIENT_SECRET = os.getenv('KEYCLOAK_CLIENT_SECRET')
KEYCLOAK_ADMIN_CLIENT_ID = os.getenv('KEYCLOAK_ADMIN_CLIENT_ID')
KEYCLOAK_ADMIN_CLIENT_SECRET = os.getenv('KEYCLOAK_ADMIN_CLIENT_SECRET')
KEYCLOAK_REALM = os.getenv('KEYCLOAK_REALM')
KEYCLOAK_CALLBACK_URI = os.getenv('KEYCLOAK_CALLBACK_URI') 