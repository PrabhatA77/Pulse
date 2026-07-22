import jwt from "jsonwebtoken";
import type { Response } from "express";
import {env} from "../config/env.js";

export function generateToken(userId:string):string{
    return jwt.sign({userId},env.jwtSecret,{expiresIn:env.jwtExpiresIn} as jwt.SignOptions);
};

export function setAuthCookie(res:Response,token:string){
    res.cookie("token",token,{
        httpOnly:true,
        secure:env.nodeEnv === "production",
        sameSite:env.nodeEnv === "production"?"none":"lax",
        maxAge:7*24*60*60*1000,
    });
}

export function clearAuthCookie(res:Response){
    res.clearCookie("token");
}