import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { EventRouter } from './eventshuffle/routes'
import swaggerUi from 'swagger-ui-express'

const swaggerFile = require('../src/swagger_output.json')

// Get .env parameters
dotenv.config();

// EXPRESS Setup
const app: Express = express();
const port: number = parseInt(process.env.NODE_PORT as string, 10) ?? 8080;
app.use(express.json());

// MongoDB Connection
const MONGO_USR: string = process.env.MONGO_USR ?? "root";
const MONGO_PASS: string = process.env.MONGO_PASS ?? "rootpassword";
const MONGO_URI: string = process.env.MONGO_URI ?? "mongo";
const MONGO_PORT: string = process.env.MONGO_PORT ?? "27017";
const MONGO_DB: string = process.env.MONGO_DB ?? "event";
const db = `mongodb://${MONGO_USR}:${MONGO_PASS}@${MONGO_URI}:${MONGO_PORT}/${MONGO_DB}?connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1`

mongoose.connect(db, (err) => {
  if (err) {
    console.log('[server]: Could not stablish connection to database')
  } else {
    console.log('[server]: Server is connected to database')
  }
});

// EventShuffle Routes
app.use('/api/v1/event', EventRouter);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
// For server debugging purposes, get /
// app.get('/', (req: Request, res: Response) => {
//   res.status(200).send({"status": "OK"});
// });

app.listen(port, () => {
  console.log(`[server]: Server is running on port: ${port}`);
});