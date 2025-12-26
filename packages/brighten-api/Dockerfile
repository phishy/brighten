FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY tsconfig.json ./
COPY src ./src
RUN npm install typescript && npx tsc && npm remove typescript

COPY config.yaml ./
COPY pb_migrations ./pb_migrations

EXPOSE 3001

CMD ["node", "dist/index.js"]
