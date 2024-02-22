import express, {Request , Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
// import debug from 'debug';

import cookieParser from 'cookie-parser';
import path from 'path';
import {v2 as cloudinary} from  'cloudinary';
// import routes
import {UserRoutes} from './routes/users';
import {authenticationRoute} from './routes/auth';
import { createCustomerRouter } from './routes/customers';
import { transactionRouter } from './routes/transactions';



//connection to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET,
});



//db connection
mongoose.connect(process.env.MongoDB_CONNECTION_STRING as string);

const port = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials:true,
}));



app.use(express.static(path.join(__dirname, "../../frontend/dist")));

//endpoints
app.use("/api/auth", authenticationRoute);
// /api/users/
app.use("/api/users", UserRoutes);
app.use('/api/customers', createCustomerRouter);
app.use('/api/transactions', transactionRouter);


app.get('*', (req:Request, res:Response)=> 
{
  res.sendFile(path.join(__dirname,"../../frontend/dist/index.html"));
});

app.listen(port, () => {
console.log(`Server running on http://localhost:${port}`);

});

