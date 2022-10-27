import mongoose, { HydratedDocument } from "mongoose";
import { IEvent, IEventVotes, IVote, VoteModel } from "../models";
import { EventController } from "./event.controller";
import { VoteController } from "./vote.controllers";

export class LogicController {
    constructor(){}

    eventController: EventController = new EventController();
    voteController: VoteController = new VoteController();

    // Public Functions
    public async CastVoteToEvent(id: number, tVote: IVote): Promise<IEvent> {
        const event = this.eventController.GetEventByID(id);
        if ((await event) != undefined) {
            const vote: HydratedDocument<IVote> = await this.voteController.NewVote(tVote.votes, tVote.name);
            if("_id" in vote && mongoose.isValidObjectId(vote._id)) {
                const eventVotes: IEventVotes[] = this.VoteToEventVote(vote);
                const updatedVotes: IEventVotes[] | undefined = (await event).votes?.map(eventVote => {
                    const peopleList: string[] = eventVote.people;
                    peopleList.push(vote.name);
                    return {date: eventVote.date, people: peopleList};
                });
                if (updatedVotes != undefined) {
                    return this.eventController.UpdateEventVoteList(id, updatedVotes);
                } else {
                    return {id: -1, name: "", dates: []};
                }
                
            }
        } 
        return {id: -1, name: "", dates: []};
    }

    public VoteToEventVote(vote: IVote): IEventVotes[] {
        const eventVotes: IEventVotes[] = vote.votes.map(date => {
            let nameList : string[] = [vote.name]
            return {date: date, people: nameList }
        });

        return eventVotes;
    } 
}

module.exports = { LogicController }