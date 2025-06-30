import express, {Request,Response} from "express";
import z from "zod";
import dotenv from "dotenv";
import bcrypt from "bcryptjs"
import { connectToDb } from "./connectDB";
import { userModel } from "./models/user";
import { UserInput, userSchema } from "./models/zodSchema";
import jwt from "jsonwebtoken";

const JWT_PASS = "1234@";
dotenv.config();
const app = express();
//app uses 

app.use(express.json());
app.use(express.urlencoded({extended:true}));
//DB connection 
const dbURL:string = process.env.MONGO_URL as string;
connectToDb(dbURL);


//signin Route

app.post("/app/v1/signup", async (req:Request, res:Response):Promise<any> => { //it return a promise i.e. it should have Promise<any>
  try {
    // Step 1 - Validate the user input data
    const validatedata: UserInput = userSchema.parse(req.body);

    // Step 2 - Check if the username already exists
    const existingUser = await userModel.findOne({ userName: validatedata.userName });
    if (existingUser) {
      return res.status(403).json({ message: "User Already Exists" });
    }

    // Step 3 - Save new user
    const { userName, password } = validatedata;
    //step 5 hashing password 
    const saltRounds = 10;
    const hashedPass:string = await bcrypt.hash(password, saltRounds);//saltrounds is necesary 
    console.log(hashedPass);
    await userModel.create({ userName:userName, password:hashedPass });

    return res.status(200).json({ message: "User signed Up" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(411).json({ errors: err.errors }); // Input validation failed
    }

    console.error("Server error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/app/v1/signin", async (req:Request,res:Response):Promise<any>=>{
    const {userName , password } = req.body;
    console.log(userName);
    console.log(password);
    const userExists = await userModel.findOne({userName:userName});
    console.log(userExists);
    if(!userExists  || !userExists.password){
       return res.status(401).json({message:"Invalid username "})
    }
    const passwordMatch = await bcrypt.compare(password , userExists.password);
    if(!passwordMatch)return res.status(401).json({message:"Invalid password "});
    //sucess login 
    const token = jwt.sign({
        id:userExists._id
    }, JWT_PASS , {expiresIn:"24h"});
    return res.status(201).json({ message: "Login successfull " + token });
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

app.listen(8080 , ()=>{
  console.log("Server is at 8080");
})