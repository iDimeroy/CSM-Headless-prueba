# Headless CMS — Spring Boot + Astro

Un sistema CMS headless completo donde los administradores ensamblan páginas a partir de "bloques" reutilizables.

## Estructura del Proyecto

```
F_COBATAB/
├── docker-compose.yml          # PostgreSQL + pgAdmin
├── backend/                    # Spring Boot 3.2 (Java 21)
│   ├── pom.xml
│   ├── mvnw.cmd
│   ├── .mvn/wrapper/
│   └── src/main/
│       ├── java/com/cobatab/cms/
│       │   ├── HeadlessCmsApplication.java
│       │   ├── entity/         (User, Page, Block)
│       │   ├── repository/     (UserRepository, PageRepository, BlockRepository)
│       │   ├── dto/            (PageResponseDto, BlockDto, LoginRequestDto, ...)
│       │   ├── mapper/         (PageMapper)
│       │   ├── service/        (PageService, AuthService)
│       │   ├── controller/     (PublicPageController, AdminController, AuthController)
│       │   ├── security/       (JwtUtil, JwtAuthFilter, SecurityConfig)
│       │   └── exception/      (GlobalExceptionHandler)
│       └── resources/
│           ├── application.yml
│           └── db/migration/   (V1…V4 Flyway SQL)
└── frontend/                   # Astro 4 (SSR)
    ├── astro.config.mjs
    ├── package.json
    ├── .env
    └── src/
        ├── layouts/BaseLayout.astro
        ├── pages/
        │   ├── index.astro         (→ /inicio)
        │   └── [slug].astro        (Página dinámica)
        └── components/
            ├── BlockRenderer.astro
            └── blocks/
                ├── HeroSection.astro
                ├── TextWithImage.astro
                └── FeaturesList.astro
```

## Inicio Rápido

### 1. Infraestructura (PostgreSQL)

```powershell
docker-compose up -d
```

Verifica en `http://localhost:5050` (pgAdmin)  
Email: `admin@cms.local` | Password: `admin123`

---

### 2. Backend (Spring Boot)

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

El backend arranca en `http://localhost:8080`.  
Flyway ejecuta las migraciones automáticamente al inicio.

---

### 3. Frontend (Astro)

```powershell
cd frontend
npm install
npm run dev
```

El frontend arranca en `http://localhost:4321`.  
Visita `http://localhost:4321/inicio` para ver la página de prueba.

---

## API REST

### Autenticación
```http
POST /api/v1/auth/login
Content-Type: application/json

{"username": "admin", "password": "admin123"}
```
Respuesta: `{ "token": "...", "username": "admin", "role": "ADMIN" }`

### Obtener página (público)
```http
GET /api/v1/pages/inicio
```

### Admin: Crear página (requiere JWT)
```http
POST /api/v1/admin/pages
Authorization: Bearer <token>
Content-Type: application/json

{
  "slug": "nosotros",
  "title": "Sobre Nosotros",
  "seoTitle": "Conoce Nuestro Equipo",
  "status": "PUBLISHED"
}
```

### Admin: Agregar bloque a una página
```http
POST /api/v1/admin/pages/{pageId}/blocks
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "HeroSection",
  "sortOrder": 1,
  "payload": {
    "title": "Sobre Nosotros",
    "subtitle": "Conoce al equipo detrás de la tecnología."
  }
}
```

---

## Credenciales por Defecto

| Servicio  | Usuario          | Contraseña  |
|-----------|-----------------|-------------|
| CMS Admin | admin           | admin123    |
| pgAdmin   | admin@cms.local | admin123    |
| PostgreSQL | cms_user       | cms_password |

---

## Agregar Nuevos Bloques

1. **Backend**: Crea páginas con `type: "MiBloque"` via la API admin.
2. **Frontend**: Crea `src/components/blocks/MiBloque.astro` con las props del payload.
3. **Registra**: Agrega `MiBloque` al map en `BlockRenderer.astro`.

```astro
import MiBloque from './blocks/MiBloque.astro';

const BLOCK_MAP = {
  HeroSection,
  TextWithImage,
  FeaturesList,
  MiBloque,   // ← nuevo
};
```
