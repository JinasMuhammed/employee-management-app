# 1) Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN npm run build -- --configuration=production

# 2) Serve
FROM nginx:stable-alpine
COPY --from=build /app/dist/ems /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]