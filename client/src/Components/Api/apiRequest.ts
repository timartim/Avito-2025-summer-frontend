// apiRequest.ts
import apiClient from './api';

export async function apiRequest<T>(
   method: 'get' | 'post' | 'put' | 'patch' | 'delete',
   url: string,
   data?: unknown,
   params?: Record<string, unknown>
): Promise<T> {
   try {
      const response = await apiClient.request<T>({
         url,
         method,
         data,
         params,
      });
      return response.data;
   } catch (error: any) {

      console.error('API Request Error:', error);
      throw error;
   }
}
