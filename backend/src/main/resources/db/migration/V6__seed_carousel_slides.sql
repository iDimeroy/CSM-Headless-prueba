-- V6: Seed sample carousel slides
INSERT INTO carousel_slides (titulo, descripcion, imagen_url, boton_texto, boton_url, orden, estado)
VALUES
    ('Bienvenidos al COBATAB',
     'Colegio de Bachilleres de Tabasco — Comprometidos con la educación de calidad.',
     'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
     'Conocer más',
     '/inicio',
     1,
     'PUBLISHED'),
    ('Inscripciones Abiertas 2026',
     'Consulta los requisitos y fechas para el proceso de inscripción.',
     'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
     'Ver requisitos',
     '/inscripciones',
     2,
     'PUBLISHED'),
    ('Oferta Educativa',
     'Descubre nuestros programas académicos y de desarrollo integral.',
     'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80',
     'Explorar',
     '/oferta-educativa',
     3,
     'PUBLISHED');
