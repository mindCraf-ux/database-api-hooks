
// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import express from "express"

/*import mongoose from "mongoose";
import { DB_NAME } from "./constants";*/


import connectDB from "../src/db/index.js";

dotenv.config({ path: '.env' });

const app = express();

connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port : ${process.env.PORT || 8000}`);
  })
})
.catch((err) =>{
  console.error('Error starting the server:', err);
})

/*

//First approach to connect to DB

import express from "express";
import dotenv from "dotenv";
const app = express()


( async ()=> {
  try{
await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
app.on("error", (error) => {
  console.log("ERROR in connecting to DB")
  throw error
})

app.listen(process.env.PORT, () =>{
  console.log(`Server is running on port ${process.env.PORT}`);
})
  }
  catch(err){
    console.error("ERROR:", error)
    throw err
  }

})()

*/ 