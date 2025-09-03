# frontend/Dockerfile (Vite)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
ENV PORT=3000
CMD ["sh", "-c", "serve -s dist -l $PORT"]
