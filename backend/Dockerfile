FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Installa TUTTE le dipendenze, incluse devDependencies
RUN npm install

# Installa TypeScript globalmente
RUN npm install -g typescript

COPY . .

# Compila TypeScript
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
