import express, { Request, Response } from 'express';
import { EventController, VoteController } from '../controllers'

// Initialize Router & Controllers
const router = express.Router();
const eventController = new EventController();
const voteController = new VoteController();

// GET ROUTES
//// List all events
router.get("/list", async (req, res) => { eventController.GetEventList(req, res)})

//// Show an event
router.get("/:id", async (req, res) => { eventController.GetEvent(req, res) })

//// Show event results
router.get("/:id/results", async (req: Request, res: Response) => {
    res.status(501).send({"status": "Not Implemented"})
})

// POST ROUTERS
//// Create event
router.post("/", (req, res) => { eventController.CreateEvent(req, res)} )

//// Cast vote to an event
router.post("/:id/vote", async (req, res) => { voteController.CreateVote(req, res) })

module.exports = router;