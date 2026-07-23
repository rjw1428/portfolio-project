# Static experience pages + Express server — no build step required.
FROM node:22-alpine

WORKDIR /app

COPY poc ./poc
COPY server ./server

WORKDIR /app/server
RUN npm install --omit=dev

EXPOSE 3201

CMD ["node", "index.js"]
