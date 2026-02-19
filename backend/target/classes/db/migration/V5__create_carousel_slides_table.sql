-- V5: Create carousel_slides table
CREATE TABLE carousel_slides (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo          VARCHAR(255)  NOT NULL,
    descripcion     TEXT,
    imagen_url      VARCHAR(500),
    fecha_inicio    TIMESTAMP,
    fecha_final     TIMESTAMP,
    boton_texto     VARCHAR(50),
    boton_url       VARCHAR(500),
    orden           INT           NOT NULL DEFAULT 1,
    estado          VARCHAR(20)   NOT NULL DEFAULT 'DRAFT',
    created_at      TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT now(),
    created_by      UUID          REFERENCES users(id)
);

CREATE INDEX idx_carousel_slides_estado ON carousel_slides(estado);
CREATE INDEX idx_carousel_slides_orden  ON carousel_slides(orden);
