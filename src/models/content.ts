import mongoose, { model, Schema } from "mongoose";
const contentTypes = ["video" , "image" , "article" , "audio"];//types that are only possible 
const contentSchema = new Schema({
    link:{type:String , require:true},
    type:{type:String , enum:contentTypes , require:true},
    tittle:{type:String , required:true},
    tags:[{type:mongoose.Types.ObjectId , ref:'Tag'}],
    userId : {type:mongoose.Types.ObjectId , ref:'User' , require:true}
})
export const contentModel = model("Content" , contentSchema);