export interface Pet {
    _id            : string;
    user           : string;
    name           : string;
    comment        : string;
    activity       : PetActivities[];
    priceSummary?   : PriceSummary;
    activityPrices : ActivityPrices;
}

export interface PetActivities {
    _id?         : string;
    date         : string;
    activityType : ActivityType;
    paid         : boolean;
    note?        : string;
}

export enum ActivityType {
    Paseo     = 'Paseo',
    Cuidado   = 'Cuidado',
    Guarderia = 'Guardería'
}

export interface PriceSummary {
    total   : number;
    pending : number;
}

export interface ActivityPrices {
    dailyWalkPrice      : number;
    weeklyWalkPrice     : number;
    dailyGuarderiaPrice : number;
    dailyCuidadoPrice   : number;
}