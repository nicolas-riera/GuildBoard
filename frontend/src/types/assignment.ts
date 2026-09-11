import { Difficulty } from "../components/enums";

export interface AssignmentResponse {
    id : number; 
    questId : number;
    questTitle : string;
    questDifficulty : Difficulty;
    xpReward : number;
    goldReward : number;
    assignedAt : string;
    completedAt : string | null;
}

export interface CreateAssignmentRequest{
    adventurer : string;
    quest : string;
    assignedAt : Date ;
}