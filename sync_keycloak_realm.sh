#!/bin/bash

# Script for automatic synchronization of Keycloak Realm configuration
# Usage: ./sync_keycloak_realm.sh [target_server1] [target_server2] ...

# Check for Python and required libraries
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check for requests library
python3 -c "import requests" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing requests library..."
    pip3 install requests
fi

# Check for synchronization script
if [ ! -f "sync_keycloak_realm.py" ]; then
    echo "Error: sync_keycloak_realm.py script not found"
    exit 1
fi

# Check for environment variables file
if [ ! -f ".env.loc" ]; then
    echo "Error: .env.loc file not found"
    exit 1
fi

# Check for realm-export.json file
if [ ! -f "realm-export.json" ]; then
    echo "Error: realm-export.json file not found"
    exit 1
fi

# Load environment variables
source .env.loc

# Check for required variables
if [ -z "$KEYCLOAK_ADMIN_CLIENT_ID" ] || [ -z "$KEYCLOAK_ADMIN_CLIENT_SECRET" ]; then
    echo "Error: Not all required environment variables are set"
    exit 1
fi

# Check for arguments
if [ $# -lt 1 ]; then
    echo "Usage: $0 [target_server1] [target_server2] ..."
    echo "Example: $0 http://localhost:7071 http://localhost:7072"
    exit 1
fi

TARGET_SERVERS=$@

# Form string with target servers
TARGET_SERVERS_STR=""
for server in $TARGET_SERVERS; do
    TARGET_SERVERS_STR="$TARGET_SERVERS_STR $server"
done

# Run synchronization script
echo "Starting synchronization..."
echo "Using realm-export.json as source"
echo "Target servers: $TARGET_SERVERS_STR"

python3 sync_keycloak_realm.py \
    --source-file "realm-export.json" \
    --target-servers $TARGET_SERVERS_STR \
    --target-admin "$KEYCLOAK_ADMIN_CLIENT_ID" \
    --target-password "$KEYCLOAK_ADMIN_CLIENT_SECRET"

# Check execution result
if [ $? -eq 0 ]; then
    echo "Synchronization completed successfully"
else
    echo "Error during synchronization"
    exit 1
fi 