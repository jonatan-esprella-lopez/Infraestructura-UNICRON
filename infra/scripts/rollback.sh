#!/usr/bin/env sh
set -eu

ENVIRONMENT="${1:-local}"
docker compose -f "infra/docker/$ENVIRONMENT/docker-compose.yml" down
echo "Rollback completed for $ENVIRONMENT"
