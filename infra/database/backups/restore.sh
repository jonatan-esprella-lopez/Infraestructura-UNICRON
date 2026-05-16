#!/usr/bin/env sh
set -eu

: "${DATABASE_URL:?DATABASE_URL is required}"
: "${BACKUP_FILE:?BACKUP_FILE is required}"

psql "$DATABASE_URL" < "$BACKUP_FILE"
echo "Backup restored from $BACKUP_FILE"
