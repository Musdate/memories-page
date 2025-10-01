import { ActivityType } from "./pet.interface";

export interface CreateActivityDto {
    date: string;
    activityType: ActivityType;
    paid? : boolean;
    note? : string;
}