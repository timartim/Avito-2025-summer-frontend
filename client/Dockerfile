# 1) Stage: сборка приложения
FROM node:20-alpine AS build
WORKDIR /app

#  Получаем базовый URL API как build‑ARG
ARG VITE_API_BASE_URL=http://localhost:8081/api/v1
# Экспортируем его в ENV, чтобы Vite «увидел»
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# копируем package.json
COPY package.json ./

# устанавливаем зависимости

RUN npm install

# копируем весь код и собираем фронтенд
COPY . .
RUN npm run build

# 2) Stage: nginx
FROM nginx:stable-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
