FROM node:20-alpine

WORKDIR /app

COPY . ./waygo-front

WORKDIR /app/waygo-front

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "deploy"]
