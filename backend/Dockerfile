FROM rust:1.74.0-alpine3.18 as builder

WORKDIR /app

COPY . .

# Natively the compilation fails. We need this
# source: https://github.com/ocaml/opam-repository/issues/13718#issuecomment-475550590
RUN apk add --no-cache musl-dev

RUN cargo build --release

###
###
###

FROM scratch

WORKDIR /app

COPY --from=builder /app/target/release/backend /app/portal

CMD ["/app/portal"]
