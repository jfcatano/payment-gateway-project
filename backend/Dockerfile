FROM node:22-alpine3.20

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run seed

EXPOSE 3000

CMD ["npm", "start"]
