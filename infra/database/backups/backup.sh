#!/usr/bin/env sh
set -eu

: "${DATABASE_URL:?DATABASE_URL is required}"
: "${BACKUP_FILE:=backup-$(date +%Y%m%d%H%M%S).sql}"

pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
echo "Backup written to $BACKUP_FILE"
