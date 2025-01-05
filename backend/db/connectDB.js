import mongoose from "mongoose";

import dotenv from 'dotenv'

dotenv.config();
export const  connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to database");
    }catch(error){
        console.log("not able to connect to database"+error.message);
    }
}

// module.exports=connectDB
