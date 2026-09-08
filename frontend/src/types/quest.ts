import { Difficulty } from "../enums";

import { QuestStatus } from "../enums";

export interface QuestResponse{
    id : number;
    title : string;
    difficulty : Difficulty;
    requiredLevel : number;
    goldReward : number;
    xpReward : number;
    status : QuestStatus;
}

export interface CreateQuestRequest{
    title : string;
    desctiption : string;
    difficulty : Difficulty;
    requiredLevel : number;
    goldReward : number;
    xpReward : number;
}

export interface UpdateQuestRequest{
    title : string;
    desctiption : string;
    difficulty : Difficulty;
    requiredLevel : number;
    goldReward : number;
    xpReward : number;
}

export interface QuestAssignmentRequest{
    adventurerId : number;
}

