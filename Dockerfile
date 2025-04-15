FROM node:20.13.1-alpine as builder

WORKDIR /app

COPY package.json ./
COPY . .

RUN npm install

FROM node:20.13.1-alpine as application

WORKDIR /app

COPY --from=builder /app /app

COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

