import { CharacterClass } from "../enums";

export interface AdventurerResponse{
    id : number; 
    name : string;
    CharacterClass : CharacterClass;
    level : number;
    xp : number;
    gold : number;
}
