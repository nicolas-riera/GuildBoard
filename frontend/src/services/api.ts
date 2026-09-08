import type { ApiError } from '../types/exception';

const BASE_URL = 'http://localhost:8080/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorData: ApiError = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
        // if response aren't json formatted
    }
    throw new Error(errorMessage);
  }

  // For requests that doesn't send reponses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}