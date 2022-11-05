import express, { Request, Response } from 'express';
import { GetEventList, GetEvent, CreateEvent, CreateVote, GetEventResults } from '../controllers'

// Initialize Router & Controllers
const router = express.Router();


// GET ROUTES
//// List all events
router.get("/list", async (req, res) => { GetEventList(req, res)})

//// Show an event
router.get("/:id", async (req, res) => { GetEvent(req, res) })

//// Show event results
router.get("/:id/results", async (req, res) => { GetEventResults(req, res) })

// POST ROUTERS
//// Create event
router.post("/", (req, res) => { CreateEvent(req, res)} )

//// Cast vote to an event
router.post("/:id/vote", async (req, res) => { CreateVote(req, res) })

module.exports = router;