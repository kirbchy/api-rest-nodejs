# Imagen base
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar deps
COPY package.json package-lock.json* ./
RUN npm ci || npm install --no-audit --no-fund

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 4000

# Comando por defecto
CMD ["npm", "start"]
