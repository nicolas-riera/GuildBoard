import { CharacterClass } from "../components/enums";

export interface AdventurerResponse{
    id : number; 
    name : string;
    CharacterClass : CharacterClass;
    level : number;
    xp : number;
    gold : number;
}

export interface UpdateAdventurerRequest{
    name : string;
    CharacterClass : CharacterClass;
    level : number;
    xp : number;
    gold : number;
}

export interface CreateAdventurerRequest{
    name : string;
    CharacterClass : CharacterClass;
}

