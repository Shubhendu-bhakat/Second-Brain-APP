import { model, Schema } from "mongoose";

const userSchema = new Schema({
   userName:{type:String , require:true , unique:true},
   password:{type:String, require:true}
})
export const userModel = model("User",userSchema); // "User" is going to be the name of the collection 