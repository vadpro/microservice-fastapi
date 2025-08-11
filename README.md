# microservice-fastapi

Example microservice architecture with fastapi and keycloak

## Getting started

# Add few lines to /etc/hosts
```
127.0.0.1 api-movie.dj
127.0.0.1 api-cast.dj
127.0.0.1 microservice-app.dj
127.0.0.1 microservice-app.ng
```

# Up project
```
./up.sh

```

### Test
### Create user when starting project at local server
# 1. KeyCloack (Default login: admin / admin)
http://localhost:7070/
# 2. Click "Create realm"
# 3. Resource file -> Browse -> Select file from project -> keycloak -> realm-export.json -> Create
# 4. Goto Users -> Create new user
#       Username = "admin"
#       Email = "admin@admin.com"
#       First name = "first"
#       Last name = "user"
#    CLick "Create"
# 5. User -> Credentials -> Set password -> 123123 (Temporary = Off) -> Save
# 6. Goto Clients -> admin-cli -> Credentials -> Regenerate -> Copy password to:
# 6.1 to ".env.loc" -> KEYCLOAK_ADMIN_CLIENT_SECRET=...  
# 6.2 to postman -> environments -> KEYCLOAK_ADMIN_CLIENT_SECRET=...  
# 7. Restart project
# 8. In postman send request: 
#      Fast API -> Auth -> Login [admin] [password] [FastApiClient]



# dev
http://api-cast.dj/
http://api-movie.dj/

# Nginx movies API
http://microservice-app.ng/api/v1/movies/

# Nginx casts API
http://microservice-app.ng/api/v1/casts/

# React (Next)
http://microservice-app.dj/
http://microservice-app.ng/
