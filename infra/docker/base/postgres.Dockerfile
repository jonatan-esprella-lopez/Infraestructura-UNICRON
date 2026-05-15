FROM postgres:16-alpine

COPY infra/database/postgres/extensions.sql /docker-entrypoint-initdb.d/01-extensions.sql
COPY infra/database/postgres/roles.sql /docker-entrypoint-initdb.d/02-roles.sql
COPY infra/database/postgres/init.sql /docker-entrypoint-initdb.d/03-init.sql
