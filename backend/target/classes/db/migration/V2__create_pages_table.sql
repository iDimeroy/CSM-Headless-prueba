-- V2: Create pages table
CREATE TABLE pages (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(255) NOT NULL UNIQUE,
    title       VARCHAR(255) NOT NULL,
    seo_title   VARCHAR(255),
    status      VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    author_id   UUID         REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pages_slug   ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
