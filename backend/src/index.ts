import express, {Request , Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import authRoutes from 'cookie-parser';
// import debug from 'debug';
// import routes
import {UserRoutes} from './routes/users';
import {authenticationRoute} from './routes/auth';
import cookieParser from 'cookie-parser';
import path from 'path';





const port = process.env.PORT || 3000;

//db connection
mongoose.connect(process.env.MongoDB_CONNECTION_STRING as string);
// .then(()=> console.log("DB", process.env.MongoDB_CONNECTION_STRING));

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials:true,
}));

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authenticationRoute)
// /api/users/
app.use("/api/users", UserRoutes)

// app.get(`/api/`, async (req: Request, res: Response) => {
//   res.json({message: `back end.`});
//   debugServer(`server running on port ${2025}`);
// });

app.listen(port, () => {
console.log(`Server running on http://localhost:${port}`);

});

