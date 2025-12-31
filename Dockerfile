# Stage 1: Build the React app
FROM node:16-alpine as builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Create the production server
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY server ./server

WORKDIR /app/server
RUN npm install

EXPOSE 3201

CMD ["node", "index.js"]
