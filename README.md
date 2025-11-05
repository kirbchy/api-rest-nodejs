# Node Arbitros API

API REST en Node/Express para Árbitros que consume la API de Spring Boot del proyecto CABA. Maneja autenticación JWT (solo para árbitros), documentación Swagger y fotos en AWS S3 (acceso público).

## Configuración

1. Copia `.env.example` a `.env` y configura:
   - `SPRING_API_BASE` (ej: http://localhost:8080)
   - `AWS_REGION`, `S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
   - `JWT_SECRET`

2. Instala dependencias y ejecuta:
```powershell
npm install
npm run dev
```

Swagger: http://localhost:4000/api-docs

## Endpoints principales
- `POST /api/auth/register` — Crea árbitro en Spring y devuelve JWT
- `POST /api/auth/login` — Valida contra Spring (username/contraseña) y devuelve JWT
- `GET /api/arbitros` — Lista de árbitros (requiere Bearer JWT)
- `GET /api/arbitros/{id}` — Detalle
- `GET /api/arbitros/search?username=` — Buscar por username
- `GET /api/arbitros/cedula/{cedula}` — Buscar por cédula
- `POST /api/arbitros` — Crear (multipart opcional `photo`) y subir foto a S3
- `PUT /api/arbitros/{id}` — Actualizar (multipart opcional `photo`)
- `DELETE /api/arbitros/{id}` — Borrar

Notas:
- Las fotos se suben a S3 bajo `arbitros/{id}/...` con ACL `public-read`. `photoUrlS3` se incluye en las respuestas de creación/consulta.
- La API de Spring Boot mantiene la información de árbitros; esta API no persiste datos propios (solo S3 para fotos).

## Docker
Construir imagen local y ejecutar:
```powershell
# Opcional: construir
docker build -t node-arbitros-api:latest .
# Ejecutar
docker run -p 4000:4000 --env-file .env node-arbitros-api:latest
```

## CI/CD (DockerHub)
- Crea secretos en GitHub del repo Node: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`.
- El workflow `.github/workflows/docker-publish.yml` construye y publica `latest` a DockerHub.

## Seed (crear 7-10 árbitros)
```powershell
npm run seed
```
Ajusta la lista en `scripts/seedArbitros.js` según necesites.
