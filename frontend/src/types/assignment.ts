import { Difficulty } from "../enums";

export interface AssignementResponse {
    id : number; 
    questId : number;
    questTitle : string;
    questDifficulty : Difficulty;
    xpReward : number;
    goldReward : number;
    assignedAt : Date;
    completedAt : Date;
}

export interface CreateAssignementRequest{
    adventurer : string;
    quest : string;
    assignedAt : Date ;
}