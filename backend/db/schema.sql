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

-- create a new flat table to store catalog runs
CREATE TABLE IF NOT EXISTS catalog_runs
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP NOT NULL,
    catalog_slug  VARCHAR(255)              NOT NULL,
    service_slug  VARCHAR(255)              NOT NULL,
    status        status                    NOT NULL,
    input_payload JSONB DEFAULT '{}'::jsonb NOT NULL,
    tasks         JSONB DEFAULT '{}'::jsonb NOT NULL
);

CREATE INDEX IF NOT EXISTS catalog_runs_catalog_slug_idx ON catalog_runs (catalog_slug);
CREATE INDEX IF NOT EXISTS catalog_runs_service_slug_idx ON catalog_runs (service_slug);
