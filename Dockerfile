FROM node:18

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

RUN npm install -f

COPY . .

RUN npm run build

RUN npm run typeorm

RUN npm run migration:generate -- db/migrations/new_migrations

RUN npm run migration:run

RUN npm run seed

CMD ["node", "dist/main"]