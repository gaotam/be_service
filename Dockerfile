FROM node:18-alpine3.16
LABEL maintainer="Hoang Bui <mynamebvh@gmail.com>"

WORKDIR /app
RUN mkdir -p ./src/uploads
RUN mkdir -p /node_modules && chown node:node -R /node_modules /app
RUN npm install -g pm2 cross-env

USER node

COPY --chown=node:node package.json ./

RUN npm install

COPY --chown=node:node . ./
RUN npx prisma generate

EXPOSE 3000