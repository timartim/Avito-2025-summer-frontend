// apiRequest.ts
import apiClient from './api.ts';

/**
 * Универсальная функция для выполнения HTTP‑запросов через настроенный axios‑клиент.
 *
 * @template T Тип данных, ожидаемых в ответе от сервера.
 * @param method HTTP‑метод запроса ('get', 'post', 'put', 'patch', 'delete').
 * @param url     Путь к ресурсу относительно базового URL клиента.
 * @param data    Тело запроса для методов, допускающих передачу данных (post, put, patch).
 * @param params  Параметры строки запроса (для get и delete запросов).
 * @returns       Промис с данными типа T, полученными в ответе от сервера.
 * @throws        Ошибка запроса, если выполнение не удалось.
 */
export async function apiRequest<T>(
   method: 'get' | 'post' | 'put' | 'patch' | 'delete',
   url: string,
   data?: unknown,
   params?: Record<string, unknown>
): Promise<T> {
   try {
      // Выполняем запрос через общий клиент с указанным методом, URL и опциями
      const response = await apiClient.request<T>({
         url,
         method,
         data,
         params,
      });
      return response.data;
   } catch (error: any) {
      // Логируем ошибку для упрощённой отладки
      console.error('API Request Error:', error);
      throw error;
   }
}
