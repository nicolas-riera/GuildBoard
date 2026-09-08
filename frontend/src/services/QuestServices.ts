import { fetchApi } from './api';

import type {
  QuestResponse,
  CreateQuestRequest,
  UpdateQuestRequest,
  QuestAssignmentRequest,
} from '../types/quest';

import type { 
    AssignmentResponse, 
} from '../types/assignment';

export async function getQuests(): Promise<QuestResponse[]> {
    return fetchApi<QuestResponse[]>("/quests")
}

export async function getQuestById(id: number): Promise<QuestResponse[]> {
    return fetchApi<QuestResponse[]>(`/quests/${id}`)
}

export async function createQuest(
    data : CreateQuestRequest
): Promise<QuestResponse[]> {
    return fetchApi("/quests", {
        method: "POST",
        body: JSON.stringify(data)
    })
}

export async function updateQuest(
  id: number,
  data: UpdateQuestRequest
): Promise<QuestResponse> {
  return fetchApi<QuestResponse>(`/quests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteQuest(id: number): Promise<void> {
  return fetchApi<void>(`/quests/${id}`, {
    method: 'DELETE',
  });
}

export async function completeQuest(id: number): Promise<QuestResponse> {
  return fetchApi<QuestResponse>(`/quests/${id}/completion`, {
    method: 'POST',
  });
}

export async function assignQuest(
  id: number,
  data: QuestAssignmentRequest
): Promise<AssignmentResponse> {
  return fetchApi<AssignmentResponse>(`/quests/${id}/assignment`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}