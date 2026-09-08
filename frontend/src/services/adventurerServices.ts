import { fetchApi } from './api';

import type {
  AdventurerResponse,
  UpdateAdventurerRequest,
  CreateAdventurerRequest,
} from '../types/adventurer';
import type { AssignmentResponse } from '../types/assignment';

export async function getAdventurers(): Promise<AdventurerResponse[]> {
  return fetchApi<AdventurerResponse[]>('/adventurers');
}

export async function getAdventurerById(id: number): Promise<AdventurerResponse> {
  return fetchApi<AdventurerResponse>(`/adventurers/${id}`);
}

export async function createAdventurer(
  data: CreateAdventurerRequest
): Promise<AdventurerResponse> {
  return fetchApi<AdventurerResponse>('/adventurers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdventurer(
  id: number,
  data: UpdateAdventurerRequest
): Promise<AdventurerResponse> {
  return fetchApi<AdventurerResponse>(`/adventurers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdventurer(id: number): Promise<void> {
  return fetchApi<void>(`/adventurers/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdventurerHistory(
  id: number
): Promise<AssignmentResponse[]> {
  return fetchApi<AssignmentResponse[]>(`/adventurers/${id}/history`);
}