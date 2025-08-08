
export DOMAIN=$1

docker exec nginx-proxy \
    openssl req -x509 \
    -newkey rsa:4096 \
    -sha256 \
    -nodes \
    -days 365 \
    -subj '/CN=${DOMAIN}'  \
    -keyout /etc/nginx/certs/${DOMAIN}.key \
    -out /etc/nginx/certs/${DOMAIN}.crt

docker exec nginx-proxy nginx -s reload

