export interface User{
    id:string;
    username:string;
    email:string;
    role:"user"|"admin";
}

export interface ApiError{
    message:string;
}