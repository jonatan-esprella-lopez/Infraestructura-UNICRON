# API examples

Use these baseline endpoints while the API is still running in memory:

```bash
curl http://127.0.0.1:4000/health
curl http://127.0.0.1:4000/api/v1/crm
curl -X POST http://127.0.0.1:4000/api/v1/crm/leads \
  -H "content-type: application/json" \
  -d "{\"name\":\"Ada Lovelace\",\"email\":\"ada@example.com\",\"source\":\"campaign\"}"
curl -X POST http://127.0.0.1:4000/api/v1/qr/scan \
  -H "content-type: application/json" \
  -d "{\"code\":\"MISSION-001\",\"userId\":\"user_1\"}"
```
