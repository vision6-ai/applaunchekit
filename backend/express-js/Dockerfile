FROM node:alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json package-lock.json ./

USER node

RUN npm install --no-save

COPY --chown=node:node . .

EXPOSE 8080
EXPOSE 9000
EXPOSE 9001
