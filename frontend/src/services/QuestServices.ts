import { fetchApi } from './api';

import type {
  QuestResponse,
  CreateQuestRequest,
  UpdateQuestRequest,
  QuestAssignmentRequest,
} from '../types/quest';

import type { 
    AssignmentResponse, 
    CreateAssignmentRequest,
} from '../types/assignment';

export async function getQuests(): Promise<QuestResponse[]> {
    return fetchApi<QuestResponse[]>("/quests")
}