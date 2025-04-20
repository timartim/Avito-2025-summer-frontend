// src/Api/api.ts
import axios from 'axios';

/**
 * HTTP‑клиент для взаимодействия с бэкенд API приложения.
 * Базовый URL настраивается через переменные окружения или берётся из дефолтного значения.
 */
const BASE_URL =
   process.env.VITE_API_BASE_URL ||
   process.env.API_BASE_URL ||
   // дефолт
   'http://localhost:8081/api/v1';

/**
 * Экземпляр axios с предустановленными опциями:
 * - baseURL: корень всех HTTP-запросов
 * - timeout: максимальное время ожидания ответа (в мс)
 * - headers: заголовки по умолчанию
 */
const apiClient = axios.create({
   baseURL: BASE_URL,
   timeout: 10000,
   headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
