import { Request, Response } from "express";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { IVote, VoteModel, IEvent } from "../models";
import { LogicController } from "../controllers"

export class VoteController {
    constructor() {};

    logicController: LogicController = new LogicController();

    // Public Functions
    public async CreateVote (req: Request, res: Response) {
        try {
            const idString: string = req.params.id;
            const id = isNaN(parseInt(idString)) ? -1 : parseInt(idString);

            if (id != -1) {
                const {votes, name} = req.body;
                const vote: IVote = {
                    name: name,
                    votes: votes
                };

                //returns Promise<IEvent>
                await this.logicController.CastVoteToEvent(id, vote).then((event) => {
                    if (event.id == undefined || event.id == -1) {
                        return {"message": "Vote could not be cast to the event with id: "+id}
                    } else {
                        return event;
                    }
                }); 

                
            } else {
                return res.status(500).send({"message": "Vote could not be cast to the event with id: "+id});
            }
        } catch (error) {
            return res.status(500).send({"message": "Event could not be created: "+error});
        }
        //res.status(501).send({"status": "Not Implemented"})
    }

    // MongoDB functions
    public async NewVote(votes: Date[], name: String): Promise<any> {
        let event: HydratedDocument<IVote> = new VoteModel({votes: votes, name: name})
        await event.save().then((savedDoc: IVote) => {
            savedDoc === event;
        });
        return event;
    }


    // Private Functions
    // MongoDB functions
};

module.exports = { VoteController };