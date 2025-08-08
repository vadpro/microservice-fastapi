#!/bin/bash

#DOCKER SETTINGS for LOCAL DEVELOPMENT
export NET="docker-proxy-overlay"
export PROJECT_IMAGE="nginxproxy/nginx-proxy"
export PROJECT_NAME="nginx-proxy"

#check if overlay network exist to connect proxy to it
if ! docker network ls | grep $NET > /dev/null
  then
    docker network create \
        --attachable \
        -d overlay \
        $NET
fi

#remove container if exist
if [ `docker ps -a | grep "$PROJECT_NAME" | wc -l` -gt 0 ]; then
  docker stop $PROJECT_NAME;
  docker rm -f $PROJECT_NAME;
fi

# Start nginx-proxy WITHOUT acme-companion for local development
docker run -d \
           --network $NET \
           -p 80:80 \
           -p 443:443 \
           --restart=always \
           -e HTTPS_METHOD=noredirect \
           -v certs:/etc/nginx/certs \
           -v vhost:/etc/nginx/vhost.d \
           -v html:/usr/share/nginx/html \
           -v /var/run/docker.sock:/tmp/docker.sock:ro \
           --name $PROJECT_NAME \
           $PROJECT_IMAGE

docker network connect bridge $PROJECT_NAME

echo "✅ nginx-proxy started for LOCAL DEVELOPMENT (without HTTPS enforcement)"
echo "📝 To enable HTTPS for production, use the original script with acme-companion"
