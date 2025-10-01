
import { ActivityType } from "./pet.interface";

export interface UpdateActivityDto {
    _id          : string;
    date         : string;
    activityType : ActivityType;
    paid         : boolean;
    note?        : string;
}