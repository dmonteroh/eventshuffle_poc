FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install --only=production && npm cache clean --force && npm install -g typescript

COPY . /usr/src/app

EXPOSE 8080

CMD ["npm", "start"]