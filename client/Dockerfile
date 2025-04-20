# Dockerfile

# 1) Stage: сборка приложения
FROM node:20-alpine AS build

WORKDIR /app

# ❶ Получаем аргумент (если не придёт – берём дефолт)
ARG VITE_API_BASE_URL=http://localhost:8081/api/v1
# ❷ Делаем его переменной окружения, чтобы Vite «увидел»
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# копируем package.json и lock-файл для npm
COPY package.json package-lock.json ./

# устанавливаем зависимости
RUN npm ci

# копируем весь исходный код и собираем
COPY . .
RUN npm run build

# 2) Stage: минимальный nginx для отдачи статики
FROM nginx:stable-alpine

# копируем собранную папку dist
COPY --from=build /app/dist /usr/share/nginx/html

# удаляем дефолтный конфиг и копируем свой
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
