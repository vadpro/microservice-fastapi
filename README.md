# microservice-fastapi

Example microservice architecture with fastapi and keycloak

## Getting started

# Add few lines to /etc/hosts
```
127.0.0.1 api-movie.dev
127.0.0.1 api-cast.dev
127.0.0.1 movie.ng
127.0.0.1 keycloak.loc
```

# Up project
```
docker compose up keycloak

```

### Test

# KeyCloack (Default login: admin / admin)
http://keycloak.loc/

# dev
http://api-cast.dev/
http://api-movie.dev/

# Nginx movies API
http://movie.ng/api/v1/movies/

# Nginx casts API
http://movie.ng/api/v1/casts/
