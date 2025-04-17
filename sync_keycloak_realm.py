#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
import sys
import requests
from urllib.parse import urljoin

def parse_args():
    parser = argparse.ArgumentParser(description='Synchronization of realm configuration between Keycloak servers using realm-export.json')
    parser.add_argument('--source-file', default='realm-export.json', help='Path to the realm-export.json file (default: realm-export.json)')
    parser.add_argument('--target-servers', required=True, nargs='+', help='URLs of target Keycloak servers (e.g., http://localhost:7071 http://localhost:7072)')
    parser.add_argument('--target-realm', help='Name of the realm on target servers (default is the same as in the export file)')
    parser.add_argument('--target-admin', default='admin', help='Name of the target servers administrator')
    parser.add_argument('--target-password', required=True, help='Password of the target servers administrator')
    parser.add_argument('--use-cli', action='store_true', help='Use Keycloak CLI instead of REST API')
    return parser.parse_args()

def get_token(server_url, realm, username, password):
    """Get access token via REST API"""
    token_url = urljoin(server_url, f'/realms/master/protocol/openid-connect/token')
    data = {
        'username': username,
        'password': password,
        'grant_type': 'password',
        'client_id': 'admin-cli'
    }
    response = requests.post(token_url, data=data)
    if response.status_code != 200:
        print(f"Error getting token: {response.text}")
        sys.exit(1)
    return response.json()['access_token']

def import_realm_cli(server_url, realm, admin, password, export_file):
    """Import realm via Keycloak CLI"""
    print(f"Importing realm {realm} via CLI...")
    
    # Copy file to container
    cmd = [
        'docker', 'cp', export_file, f'keycloak:/tmp/{os.path.basename(export_file)}'
    ]
    subprocess.run(cmd, check=True)
    
    # Configure credentials
    cmd = [
        'docker', 'exec', '-i', 'keycloak',
        '/opt/jboss/keycloak/bin/kcadm.sh', 'config', 'credentials',
        '--server', server_url,
        '--realm', 'master',
        '--user', admin,
        '--password', password
    ]
    subprocess.run(cmd, check=True)
    
    # Import realm
    cmd = [
        'docker', 'exec', '-i', 'keycloak',
        '/opt/jboss/keycloak/bin/kcadm.sh', 'import',
        '--file', f'/tmp/{os.path.basename(export_file)}',
        '--override', 'true'
    ]
    subprocess.run(cmd, check=True)
    print(f"Realm {realm} imported to {server_url}")

def import_realm_api(server_url, realm, admin, password, export_file):
    """Import realm via REST API"""
    print(f"Importing realm {realm} via REST API...")
    token = get_token(server_url, 'master', admin, password)
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # Load configuration from file
    with open(export_file, 'r') as f:
        realm_config = json.load(f)
    
    # Update realm name if it differs
    if realm_config['realm'] != realm:
        realm_config['realm'] = realm
    
    # Create or update realm
    realm_url = urljoin(server_url, f'/admin/realms')
    response = requests.post(realm_url, headers=headers, json=realm_config)
    if response.status_code not in [201, 204]:
        print(f"Error creating realm: {response.text}")
        sys.exit(1)
    
    # Import clients
    if 'clients' in realm_config:
        for client in realm_config['clients']:
            client_id = client.get('clientId')
            if not client_id:
                continue
                
            # Check if client exists
            clients_url = urljoin(server_url, f'/admin/realms/{realm}/clients')
            response = requests.get(clients_url, headers=headers, params={'clientId': client_id})
            if response.status_code != 200:
                print(f"Error checking client: {response.text}")
                continue
                
            existing_clients = response.json()
            if existing_clients:
                # Update existing client
                client_id = existing_clients[0]['id']
                client_url = urljoin(server_url, f'/admin/realms/{realm}/clients/{client_id}')
                response = requests.put(client_url, headers=headers, json=client)
            else:
                # Create new client
                client_url = urljoin(server_url, f'/admin/realms/{realm}/clients')
                response = requests.post(client_url, headers=headers, json=client)
                
            if response.status_code not in [201, 204]:
                print(f"Error importing client {client_id}: {response.text}")
    
    # Import roles
    if 'roles' in realm_config:
        for role in realm_config['roles']:
            role_name = role.get('name')
            if not role_name:
                continue
                
            # Check if role exists
            roles_url = urljoin(server_url, f'/admin/realms/{realm}/roles')
            response = requests.get(roles_url, headers=headers, params={'name': role_name})
            if response.status_code != 200:
                print(f"Error checking role: {response.text}")
                continue
                
            existing_roles = response.json()
            if existing_roles:
                # Update existing role
                role_id = existing_roles[0]['id']
                role_url = urljoin(server_url, f'/admin/realms/{realm}/roles/{role_id}')
                response = requests.put(role_url, headers=headers, json=role)
            else:
                # Create new role
                role_url = urljoin(server_url, f'/admin/realms/{realm}/roles')
                response = requests.post(role_url, headers=headers, json=role)
                
            if response.status_code not in [201, 204]:
                print(f"Error importing role {role_name}: {response.text}")
    
    print(f"Realm {realm} imported to {server_url}")

def main():
    args = parse_args()
    
    # Check if source file exists
    if not os.path.exists(args.source_file):
        print(f"Error: Source file {args.source_file} not found")
        sys.exit(1)
    
    # Load realm configuration from file
    with open(args.source_file, 'r') as f:
        realm_config = json.load(f)
    
    # Get realm name from file if not specified
    realm_name = args.target_realm or realm_config.get('realm')
    if not realm_name:
        print("Error: Realm name not found in export file and not specified with --target-realm")
        sys.exit(1)
    
    # Import realm to target servers
    for target_server in args.target_servers:
        if args.use_cli:
            import_realm_cli(target_server, realm_name, args.target_admin, args.target_password, args.source_file)
        else:
            import_realm_api(target_server, realm_name, args.target_admin, args.target_password, args.source_file)

if __name__ == '__main__':
    main() 