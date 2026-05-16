#!/usr/bin/env sh
set -eu

ENVIRONMENT="${1:-local}"

case "$ENVIRONMENT" in
  local)
    docker compose -f infra/docker/local/docker-compose.yml --env-file infra/docker/local/.env up --build -d
    ;;
  staging|production)
    docker compose -f "infra/docker/$ENVIRONMENT/docker-compose.yml" --env-file "infra/docker/$ENVIRONMENT/.env" up -d
    ;;
  *)
    echo "Unknown environment: $ENVIRONMENT" >&2
    exit 1
    ;;
esac
