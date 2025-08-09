# -----------------------------
# Etapa 1: Build del frontend
# -----------------------------
FROM node:18-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copiamos package.json e instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Variable de entorno para el backend
# Se puede pasar en el build con:
# docker build --build-arg VITE_API_URL=http://localhost:3000 .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Compilamos el proyecto para producción
RUN npm run build

# -----------------------------
# Etapa 2: Servir con Nginx
# -----------------------------
FROM nginx:stable-alpine

# Eliminamos la configuración por defecto y agregamos la nuestra
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos el build de Vite al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto
EXPOSE 80

# Comando de arranque
CMD ["nginx", "-g", "daemon off;"]
