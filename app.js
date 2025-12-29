import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
//we have to set midddleweare before routes
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: "16kb"}))
/* expressions to create a subclass that inherits from a parent class.
 This keyword allows a child class to inherit properties and methods from a parent class, enabling code reuse and hierarchical relationships */

 app.use(express.static('public'));
 app.use(cookieParser());



//routes here
import userRouter from './routes/user.routes.js';

//user routes..user decleration middleware
app.use('/api/users', userRouter); //we use userRouter for all routes starting with /users

//http://localhost:8000/api/users/register

export {app};
