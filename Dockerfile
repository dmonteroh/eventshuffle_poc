FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install && npm cache clean --force && npm install -g typescript

COPY . /usr/src/app

EXPOSE ${NODE_PORT}

CMD ["npm", "start"]