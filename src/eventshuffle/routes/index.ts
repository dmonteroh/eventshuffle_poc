import express from 'express';
import { GetEventList, GetEvent, CreateEvent, CreateVote, GetEventResults } from '../controllers'

// Initialize Router & Controllers
const EventRouter = express.Router();


// GET ROUTES
//// List all events
EventRouter.get("/list", async (req, res) => { GetEventList(req, res)})

//// Show an event
EventRouter.get("/:id", async (req, res) => { GetEvent(req, res) })

//// Show event results
EventRouter.get("/:id/results", async (req, res) => { GetEventResults(req, res) })

// POST ROUTERS
//// Create event
EventRouter.post("/", (req, res) => { CreateEvent(req, res)} )

//// Cast vote to an event
EventRouter.post("/:id/vote", async (req, res) => { CreateVote(req, res) })

export { EventRouter }