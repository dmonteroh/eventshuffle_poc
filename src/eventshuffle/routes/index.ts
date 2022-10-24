import express, { Request, Response } from 'express';
import { EventController } from '../controllers/event.controller'

// Initialize Router & Controllers
const router = express.Router();
const eventController = new EventController();

// GET ROUTES
//// List all events
router.get("/list", async (req: Request, res: Response) => { eventController.GetEventList(req, res)})

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
router.post("/:id/vote", async (req: Request, res: Response) => {
    res.status(501).send({"status": "Not Implemented"})
})

module.exports = router;