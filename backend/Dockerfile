FROM node:20-alpine

WORKDIR /app

COPY . ./

RUN npm install

EXPOSE 8080

ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}

CMD [ "npm", "run", "start" ]
