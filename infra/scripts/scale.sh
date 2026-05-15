#!/usr/bin/env sh
set -eu

ENVIRONMENT="${1:-local}"
SERVICE="${2:-api}"
REPLICAS="${3:-2}"

docker compose -f "infra/docker/$ENVIRONMENT/docker-compose.yml" up -d --scale "$SERVICE=$REPLICAS"
