import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();
const JWT_PASS:string = process.env.JWT_PASS as string;
export const userMiddleware = (req:Request , res:Response , next:NextFunction)=>{
    const headers = req.headers['authorization'];
    const decode  = jwt.verify(headers as string , JWT_PASS );
    if(decode){
        //@ts-ignore
        req.userId = decode.id;
        next();
    }else{
        res.status(403).json({message:"You are not logged in "});
    }
}