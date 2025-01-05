import express from 'express';
import { connectDB } from './db/connectDB.js'
import { configDotenv } from 'dotenv';
configDotenv();
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app=express();
app.use(cors({origin:"http://localhost:5173", credentials:true}))
app.use(express.json());
app.use(cookieParser());


const PORT=process.env.PORT || 5000;

app.use('/api/auth',authRoutes);

app.listen(PORT,()=>{
    connectDB();
    console.log("server is running on port ",PORT)
})