-- V4: Seed initial admin user
-- Password is 'admin123' encoded with BCrypt (cost 10)
INSERT INTO users (username, password_hash, role)
VALUES (
    'admin',
    '$2a$10$N.B7oLhJxk3.0u/MKJ8cQuG1JGhHhwCXTdBs6XZz/Gy8J7n.0j0M2',
    'ADMIN'
);

-- Seed sample page
INSERT INTO pages (slug, title, seo_title, status)
VALUES (
    'inicio',
    'Página de Inicio',
    'Bienvenidos a Nuestra Empresa | Soluciones Tech',
    'PUBLISHED'
);

-- Seed blocks for the sample page
INSERT INTO blocks (page_id, type, sort_order, payload)
SELECT
    p.id,
    'HeroSection',
    1,
    '{
      "title": "Transformamos tu negocio con tecnología",
      "subtitle": "Sistemas Headless escalables y seguros para el futuro web.",
      "ctaText": "Empezar ahora",
      "ctaUrl": "/contacto",
      "backgroundImage": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80"
    }'::jsonb
FROM pages p WHERE p.slug = 'inicio';

INSERT INTO blocks (page_id, type, sort_order, payload)
SELECT
    p.id,
    'TextWithImage',
    2,
    '{
      "layout": "image_left",
      "title": "Velocidad y Flexibilidad",
      "content": "<p>Al separar el backend del frontend, tu equipo de marketing puede publicar sin tocar código, mientras tus desarrolladores utilizan las mejores herramientas como Astro y Spring Boot.</p>",
      "imageUrl": "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&q=80",
      "imageAlt": "Diagrama de arquitectura Headless CMS"
    }'::jsonb
FROM pages p WHERE p.slug = 'inicio';
