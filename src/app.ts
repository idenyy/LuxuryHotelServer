import express, { Application, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';

import connectPostgres from './config/db.js';
import authRoute from './routes/auth.route.js';
import roomRoute from './routes/room.route.js';
import bookingRoute from './routes/booking.route.js';
import { updateRoomAvailability } from './controllers/booking.controller.js';
import userRoute from './routes/user.route.js';

dotenv.config();

export const app: Application = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// @ts-ignore
app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = ['http://localhost:3000', 'https://luxury-hotel-60c7b53289ed.herokuapp.com', 'https://luxury-hotel-react.vercel.app'];
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

connectPostgres();

cron.schedule('*/59 * * * *', async () => {
  console.log('Running room availability update...');
  await updateRoomAvailability();
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send(`Server is working...`);
});

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/room', roomRoute);
app.use('/api/booking', bookingRoute);

export default app;
