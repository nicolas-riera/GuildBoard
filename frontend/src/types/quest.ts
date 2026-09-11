import { Difficulty, QuestStatus } from "../components/enums";

export interface QuestResponse{
    id : number;
    title : string;
    description : string;
    difficulty : Difficulty;
    requiredLevel : number;
    goldReward : number;
    xpReward : number;
    status : QuestStatus;
}

export interface CreateQuestRequest{
    title : string;
    description : string;
    difficulty : Difficulty;
    requiredLevel : number;
    goldReward : number;
    xpReward : number;
}

export interface UpdateQuestRequest{
    title : string;
    description : string;
    difficulty : Difficulty;
    requiredLevel : number;
    goldReward : number;
    xpReward : number;
}

export interface QuestAssignmentRequest{
    adventurerId : number;
}

