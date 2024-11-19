import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from "cors";

import connectPostgres from './config/db.js';
import authRoute from './routes/auth.route.js';

dotenv.config();

export const app: Application = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || '',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }
//   })
// );
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://luxury-hotel-60c7b53289ed.herokuapp.com/",
      "https://luxury-hotel-react.vercel.app/",
    ],
    credentials: true,
  }),
);

connectPostgres();

app.get('/', (req: Request, res: Response) => {
  res.status(200).send(`Server is working...`);
});

app.use('/api/auth', authRoute);

export default app;
