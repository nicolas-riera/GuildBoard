import { Difficulty } from "../components/enums";

export interface AssignmentResponse {
    id : number; 
    questId : number;
    questTitle : string;
    questDifficulty : Difficulty;
    xpReward : number;
    goldReward : number;
    assignedAt : Date;
    completedAt : Date;
}

export interface CreateAssignmentRequest{
    adventurer : string;
    quest : string;
    assignedAt : Date ;
}