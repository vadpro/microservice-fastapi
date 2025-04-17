# Keycloak Realm Configuration Synchronization

This script allows you to synchronize realm configuration between different Keycloak servers.

## Synchronization Options

1. **Export/Import via Keycloak CLI**:
   - Uses built-in Keycloak tools for exporting and importing configuration
   - Requires access to the Keycloak container via Docker

2. **Using Keycloak REST API**:
   - Uses Keycloak REST API for exporting and importing configuration
   - Does not require access to the Keycloak container
   - Supports synchronization of realm, clients, and roles

## Requirements

- Python 3.6+
- Requests library (`pip install requests`)
- Access to Keycloak servers
- Administrator credentials for each server

## Usage

### Synchronization via REST API

```bash
python sync_keycloak_realm.py \
  --source-server http://localhost:7070 \
  --source-realm FastAPIRealm \
  --source-admin admin \
  --source-password admin \
  --target-servers http://localhost:7071 http://localhost:7072 \
  --target-admin admin \
  --target-password admin
```

### Synchronization via Keycloak CLI

```bash
python sync_keycloak_realm.py \
  --source-server http://localhost:7070 \
  --source-realm FastAPIRealm \
  --source-admin admin \
  --source-password admin \
  --target-servers http://localhost:7071 http://localhost:7072 \
  --target-admin admin \
  --target-password admin \
  --use-cli
```

### Additional Parameters

- `--target-realm` - name of the realm on target servers (default is the same as on the source)
- `--export-file` - file for export/import configuration (default is realm-export.json)

## Usage Examples

### Synchronization Between Local Servers

```bash
python sync_keycloak_realm.py \
  --source-server http://localhost:7070 \
  --source-realm FastAPIRealm \
  --source-admin admin \
  --source-password admin \
  --target-servers http://localhost:7071 \
  --target-admin admin \
  --target-password admin
```

### Synchronization Between Local and Remote Server

```bash
python sync_keycloak_realm.py \
  --source-server http://localhost:7070 \
  --source-realm FastAPIRealm \
  --source-admin admin \
  --source-password admin \
  --target-servers https://keycloak.example.com \
  --target-admin admin \
  --target-password admin
```

## Synchronization Automation

For automatic synchronization, you can create a cron job:

```bash
# Synchronization every day at 3:00
0 3 * * * cd /path/to/project && python sync_keycloak_realm.py --source-server http://localhost:7070 --source-realm FastAPIRealm --source-admin admin --source-password admin --target-servers http://localhost:7071 --target-admin admin --target-password admin >> /var/log/keycloak-sync.log 2>&1
```

## Troubleshooting

### Server Access Error

Make sure the Keycloak servers are accessible and the administrator credentials are correct.

### Error During Export/Import via CLI

Make sure the Keycloak container is running and accessible via Docker.

### Error During Export/Import via API

Check Keycloak logs for additional error information. 