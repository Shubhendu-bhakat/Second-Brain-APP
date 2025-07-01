import express, { Request, Response } from "express";
import z from "zod";
import dotenv from "dotenv";
import bcrypt from "bcryptjs"
import { connectToDb } from "./connectDB";
import { userModel } from "./models/user";
import { UserInput, userSchema } from "./models/zodSchema";
import jwt from "jsonwebtoken";
import { userMiddleware } from "./middleware";
import { contentModel } from "./models/content";
dotenv.config();

const JWT_PASS = process.env.JWT_PASS as string ;

const app = express();
//app uses 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//DB connection 
const dbURL: string = process.env.MONGO_URL as string;
connectToDb(dbURL);


//signin Route

app.post("/app/v1/signup", async (req: Request, res: Response): Promise<any> => { //it return a promise i.e. it should have Promise<any>
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
    const hashedPass: string = await bcrypt.hash(password, saltRounds);//saltrounds is necesary 

    await userModel.create({ userName: userName, password: hashedPass });

    return res.status(200).json({ message: "User signed Up" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(411).json({ errors: err.errors }); // Input validation failed
    }

    console.error("Server error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/app/v1/signin", async (req: Request, res: Response): Promise<any> => {
  const { userName, password } = req.body;
  const userExists = await userModel.findOne({ userName: userName });
  if (!userExists || !userExists.password) {
    return res.status(401).json({ message: "Invalid username " })
  }
  const passwordMatch = await bcrypt.compare(password, userExists.password);
  if (!passwordMatch) return res.status(401).json({ message: "Invalid password " });
  //sucess login 
  const token = jwt.sign({
    id: userExists._id
  }, JWT_PASS, { expiresIn: "24h" });
  return res.status(201).json({token });
});

app.post("/app/v1/content",userMiddleware, async (req:Request, res:Response) => {
    const link:string = req.body.link;
    const type:string = req.body.type;
    const tittle = req.body.tittle;
    await contentModel.create({
      link:link,
      type:type,
      tittle:tittle,
      //@ts-ignore
      userId:req.userId,
      tag:[]
    })
    res.status(200).json({
      message:"Content sucessfully Created"
    })
});

 app.get("/app/v1/content",userMiddleware, async (req:Request, res:Response):Promise<any> => {
  //@ts-ignore    
  const userId = req.userId;
  const content = await contentModel.find({
    userId:userId
  })
  return res.status(201).json({
    content
  })

 });

// app.delete("/app/v1/content", (req, res) => {

// });


// app.post("/app/v1/brain/shere", (req, res) => {

// });

// app.get("/app/v1/:shereLink", (req, res) => {

// })

app.listen(8080, () => {
  console.log("Server is at 8080");
})