import type { ApiError } from '../types/exception';

const BASE_URL = 'http://localhost:8080/api';

const CACHE_TTL_MS = 30_000;

interface CacheEntry {
  expiresAt: number;
  value: unknown;
}

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<unknown>>();

let generation = 0;

export function clearApiCache(): void {
  cache.clear();
  inFlight.clear();
  generation += 1;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if ((options?.method ?? 'GET') !== 'GET') {
    const value = await request<T>(endpoint, options);
    clearApiCache();
    return value;
  }

  const cached = cache.get(endpoint);
  if (cached !== undefined && cached.expiresAt > Date.now()) {
    return cached.value as T;
  }

  const pending = inFlight.get(endpoint);
  if (pending !== undefined) {
    return pending as Promise<T>;
  }

  const startedAt = generation;
  const promise = request<T>(endpoint, options).then((value) => {
    if (generation === startedAt) {
      cache.set(endpoint, { expiresAt: Date.now() + CACHE_TTL_MS, value });
    }
    return value;
  });

  inFlight.set(endpoint, promise);

  promise
    .catch(() => undefined)
    .finally(() => {
      if (inFlight.get(endpoint) === promise) inFlight.delete(endpoint);
    });

  return promise;
}
