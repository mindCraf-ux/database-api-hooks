import mongoose from "mongoose";

import { DB_NAME } from "../constant.js";


//second approach to connect to DB

const connectDB = async () =>{
  try{
const connectionIntance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)


console.log(`\n MONGODB connected !! DB HOST: ${connectionIntance.connection.host}`);
  }
  catch(error){
    console.log("MONGO DB CONNECTION ERROR:", error);
    process.exit(1);

  }
}

export default connectDB;