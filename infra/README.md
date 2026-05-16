# Infrastructure

Infraestructura para demos locales, staging y produccion.

## Demo local

```bash
docker compose -f infra/docker/local/docker-compose.yml --env-file infra/docker/local/.env up --build
```

Servicios incluidos:

- `web`: frontend Vite.
- `api`: backend modular monolith.
- `postgres`: base de datos local.
- `redis`: cache y colas.
- `nginx`: reverse proxy.
- `prometheus`, `grafana`, `loki`: observabilidad base.

## Health

```bash
infra/scripts/healthcheck.sh
```

En Windows PowerShell puedes usar:

```powershell
Invoke-RestMethod http://127.0.0.1:8080/health
```
