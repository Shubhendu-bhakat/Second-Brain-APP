import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MOGO_URL = process.env.MONGO_URL as string;

export async function connectToDb(URL:string):Promise<void> {
        await mongoose.connect(URL);
}
connectToDb(MOGO_URL)
.then(()=>{
     console.log("✅ Connected to DB");
}).catch((error)=>{ console.log("❌ DB connection error:", error);})
