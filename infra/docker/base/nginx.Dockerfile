FROM nginx:1.27-alpine

COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY infra/nginx/rate-limit.conf /etc/nginx/conf.d/rate-limit.conf
COPY infra/nginx/proxy.conf /etc/nginx/snippets/proxy.conf
