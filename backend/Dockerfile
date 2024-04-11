FROM rust:1.77.2-bookworm as builder

WORKDIR /app

COPY . .

RUN cargo build --release

# ---

FROM debian:bookworm-slim

WORKDIR /app

RUN apt update && apt install -y libssl-dev

COPY --from=builder /app/target/release/backend torii
COPY --from=builder /app/examples/config.yaml config.yaml

ENTRYPOINT ["/app/torii", "-c", "/app/config.yaml"]
