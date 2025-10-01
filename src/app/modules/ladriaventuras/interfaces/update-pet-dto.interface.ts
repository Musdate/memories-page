import { ActivityPrices } from "./pet.interface";

export interface UpdatePetDto {
    _id?            : string;
    name?           : string;
    comment?        : string;
    activityPrices? : ActivityPrices;
}