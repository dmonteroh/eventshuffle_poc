import { Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import { CastVoteToEvent } from "../controllers";
import { IVote, VoteModel, IEvent } from "../models";


    // Public Functions
    export const CreateVote = async (req: Request, res: Response) => {
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
                await CastVoteToEvent(id, vote).then((event) => {
                    //console.log(event);
                    if (event.id == undefined || event.id == -1) {
                        return res.status(500).send({"message": "Vote could not be cast to the event with id: "+id});
                    } else {
                        return res.status(200).send(event);
                    }
                }); 
            } else {
                return res.status(500).send({"message": "Vote could not be cast to the event with id: "+id});
            }
        } catch (error) {
            return res.status(500).send({"message": "Vote could not be created: "+error});
        }
        //res.status(501).send({"status": "Not Implemented"})
    }

    // MongoDB functions
    export const NewVote = async (votes: Date[], name: String): Promise<HydratedDocument<IVote>> => {
        let event: HydratedDocument<IVote> = new VoteModel({votes: votes, name: name})
        await event.save().then((savedDoc: IVote) => {
            savedDoc === event;
        });
        return event;
    }


    // Private Functions
    // MongoDB functions