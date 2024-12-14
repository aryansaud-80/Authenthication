import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();


app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Routes

import registerRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';

app.use('/api/v1/auth', registerRouter);

app.use("/api/v1/user", userRouter);


export default app;