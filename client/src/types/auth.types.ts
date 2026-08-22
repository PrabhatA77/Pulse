export interface User{
    id:string;
    username:string;
    email:string;
    role:"user"|"admin";
    authProvider:"local"|"google";
    fullName:string|null;
    bio:string|null;
    avatarUrl:string|null;
}

export interface ApiError{
    message:string;
}