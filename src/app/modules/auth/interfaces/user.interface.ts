export interface User {
    _id      : string;
    email    : string;
    name     : string;
    role     : string[];
    banks    : Bank[];
    isActive : boolean;
}

export interface CreateUser {
    name     : string;
    email    : string;
    password : string;
}

export interface UpdateUser {
    _id    : string;
    name   : string;
    banks? : Bank[];
}

export interface Bank {
    name   : string,
    number : string
}