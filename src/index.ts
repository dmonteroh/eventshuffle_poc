import express, {Express, Request, Response, Router} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Get .env parameters
dotenv.config();

// EXPRESS Setup
const app: Express = express();
const port: number = parseInt(process.env.PORT as string, 10);
app.use(express.json());

// MongoDB Connection
let db = "mongodb://root:rootpassword@localhost:27017/event?connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1"

mongoose.connect(db, (err) => {
  if (err) {
    console.log('[server]: Could not stablish connection to database')
  } else {
    console.log('[server]: Server is connected to database')
  }
});

// EventShuffle Routes
const eventRouter: Router = require('./eventshuffle/routes');
app.use('/api/v1/event', eventRouter);

// For server debugging purposes, get /
app.get('/', (req: Request, res: Response) => {
  res.status(200).send({"status": "OK"});
});

app.listen(port, () => {
  console.log(`[server]: Server is running on port: ${port}`);
});