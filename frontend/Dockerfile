FROM node:20-alpine3.19 as builder

WORKDIR /app

COPY . .

RUN npm ci && npm run build

# ---

FROM caddy:2.7.6-alpine

WORKDIR /app

USER nobody

COPY --chown=nobody:nobody --from=builder /app/dist/ dist/
COPY --chown=nobody:nobody Caddyfile .

ENTRYPOINT ["caddy", "run"]
