import jwt from "jsonwebtoken";
import type { Request,Response,NextFunction } from "express";
import {env} from "../config/env.js";
import {User} from "../models/user.model.js"
import { AppError } from "./errorHandler.js";

export interface AuthRequest extends Request{
    userId?:string;
    userRole?:"user"|"admin";
};

export async function protect(req:AuthRequest,_res:Response,next:NextFunction){
    const token = req.cookies?.token;
    if(!token) throw new AppError("Not Authenticated",401);

    const decoded = jwt.verify(token,env.jwtSecret) as {userId:string};
    const user = await User.findById(decoded.userId);
    if(!user) throw new AppError("User no longer exists",401);

    req.userId = decoded.userId
    req.userRole = user.role;
    next();
}

export function isAdmin(req:AuthRequest,_res:Response,next:NextFunction){
    if(req.userRole !== "admin"){
        throw new AppError("Admin access required",403);
    }
    next();
}