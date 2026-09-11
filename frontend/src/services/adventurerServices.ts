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

export interface QuestAssignment {
  adventurer: AdventurerResponse;
  assignment: AssignmentResponse;
}

export async function findQuestAssignment(
  questId: number
): Promise<QuestAssignment | null> {
  const adventurers = await getAdventurers();
  const histories = await Promise.all(
    adventurers.map((adventurer) => getAdventurerHistory(adventurer.id).catch(() => []))
  );

  let latest: QuestAssignment | null = null;

  for (const [index, history] of histories.entries()) {
    for (const assignment of history) {
      if (assignment.questId !== questId) continue;
      if (assignment.completedAt === null) {
        return { adventurer: adventurers[index], assignment };
      }
      if (
        latest === null ||
        new Date(assignment.completedAt).getTime() >
          new Date(latest.assignment.completedAt ?? 0).getTime()
      ) {
        latest = { adventurer: adventurers[index], assignment };
      }
    }
  }

  return latest;
}

export async function getOnGoingQuests(
  adventurers: AdventurerResponse[]
): Promise<Map<number, string>> {
  const histories = await Promise.all(
    adventurers.map((adventurer) => getAdventurerHistory(adventurer.id).catch(() => []))
  );

  const onGoing = new Map<number, string>();
  adventurers.forEach((adventurer, index) => {
    const active = histories[index].find((assignment) => !assignment.completedAt);
    if (active) onGoing.set(adventurer.id, active.questTitle);
  });

  return onGoing;
}
