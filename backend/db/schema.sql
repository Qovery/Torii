-- create status enum if it doesn't exist
DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
            CREATE TYPE status AS ENUM (
                'QUEUED',
                'RUNNING',
                'SUCCESS',
                'FAILURE'
                );
        END IF;
    END
$$;

-- create a new flat table to store catalog execution results
CREATE TABLE IF NOT EXISTS catalog_execution_statuses
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status status NOT NULL,
    input_payload JSONB                                      NOT NULL
);
