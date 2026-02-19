-- V3: Create blocks table with JSONB payload
CREATE TABLE blocks (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id     UUID         NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    type        VARCHAR(100) NOT NULL,
    sort_order  INTEGER      NOT NULL DEFAULT 0,
    payload     JSONB        NOT NULL DEFAULT '{}',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blocks_page_id    ON blocks(page_id);
CREATE INDEX idx_blocks_payload    ON blocks USING GIN(payload);
