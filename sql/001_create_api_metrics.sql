-- Table: api_metrics
-- Stores the result of every monitoring "ping" run against a target API.

CREATE TABLE IF NOT EXISTS api_metrics (
    id                SERIAL PRIMARY KEY,
    url               TEXT NOT NULL,
    status_code       INTEGER,
    response_time_ms  INTEGER,
    success           BOOLEAN NOT NULL DEFAULT FALSE,
    error_message     TEXT,
    created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Helpful index for querying metrics history per URL, most recent first.
CREATE INDEX IF NOT EXISTS idx_api_metrics_url_created_at
    ON api_metrics (url, created_at DESC);