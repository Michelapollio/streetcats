# Fase 1: Build dell'applicazione Angular
FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Genera i file statici distribuiti nella cartella dist/frontend/browser
RUN npm run build

# Fase 2: Runtime leggero con Nginx
FROM nginx:stable-alpine

# Copiamo i file compilati da Angular dentro la cartella pubblica di Nginx
COPY --from=build-stage /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]