import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { connectToDb } from "./connectDB";

dotenv.config();
const app = express();

//DB connection 
const dbURL:string = process.env.MONGO_URL as string;
connectToDb(dbURL);

app.post("/app/v1/signup",(req,res)=>{

});

app.post("/app/v1/signin",(req,res)=>{

});

app.post("/app/v1/content",(req,res)=>{

});

app.get("/app/v1/content",(req,res)=>{

});

app.delete("/app/v1/content",(req,res)=>{

});


app.post("/app/v1/brain/shere",(req,res)=>{

});

app.get("/app/v1/:shereLink",(req,res)=>{

})