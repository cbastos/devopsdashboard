FROM node:15.6-alpine

RUN mkdir /app
VOLUME /app
WORKDIR /app
RUN npm install --silent

EXPOSE 8080

CMD [ "npm", "start" ]
