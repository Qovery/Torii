-- create a new flat table to store catalog execution results

CREATE TABLE IF NOT EXISTS catalog_execution_statuses
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status        VARCHAR(255)                               NOT NULL,
    input_payload JSONB                                      NOT NULL
);
