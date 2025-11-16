# ---- Build ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY articulatefe/package*.json ./
RUN npm i
COPY frontend/ .
RUN npm run build   # → creates /app/dist or /app/.next etc.

# ---- Runtime ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80