# Configurar S3 público para imágenes de árbitros

1) Crear bucket
- Nombre único, región (ej: us-east-1).
- Object Ownership: Bucket owner enforced.
- Desactivar "Block all public access" en este bucket.

2) Política de bucket (lectura pública)
- En S3 > tu bucket > Permissions > Bucket policy.
- Copia `docs/bucket-policy-public-read.json` y reemplaza BUCKET_NAME por el tuyo.

3) CORS del bucket
- En S3 > tu bucket > Permissions > CORS.
- Copia `docs/bucket-cors.json` (permite GET/HEAD desde cualquier origen).

4) Usuario IAM de la app
- Crea un usuario con acceso programático.
- Asigna una política como `docs/iam-policy-app.json` (reemplaza BUCKET_NAME).
- Guarda ACCESS KEY y SECRET KEY.

5) Variables de entorno (.env)

```
AWS_REGION=us-east-1
S3_BUCKET=tu-bucket
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

6) Prueba
- Sube una foto con POST/PUT en `/api/arbitros` (campo multipart `photo`).
- La respuesta incluirá `photoUrlS3` con una URL pública: `https://<bucket>.s3.<region>.amazonaws.com/arbitros/<id>/<filename>`.

Notas
- El código no usa ACL al subir (mejor práctica con Object Ownership). La lectura pública la da la bucket policy.
- Puedes restringir CORS/Origins si necesitas.
