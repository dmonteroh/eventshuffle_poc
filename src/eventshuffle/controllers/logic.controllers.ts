import mongoose, { HydratedDocument } from "mongoose";
import { NewVote, GetEventID, UpdateEventVoteList } from "../controllers";
import { IEvent, IEventVotes, IVote } from "../models";

    // Public Functions
export const CastVoteToEvent = async (id: string, tVote: IVote): Promise<IEvent> => {
    const event = await GetEventID(id);
    if (event != undefined) {
        const vote: HydratedDocument<IVote> = await NewVote(tVote.votes, tVote.name);
        if("_id" in vote && mongoose.isValidObjectId(vote._id)) {
            const eventVotes: IEventVotes[] = VoteToEventVote(vote);
            const updatedVotes: IEventVotes[] | undefined = event.votes;
            // map felt uncomfortable to use, maybe just rusty
            // loop could be performed by a mongodb query, but need to evaluate efficiency
            
            if (updatedVotes != undefined) {
                eventVotes.forEach(eVote => {
                    updatedVotes?.forEach(uVote => {
                        if (uVote.date.valueOf() == eVote.date.valueOf() && !uVote.people.includes(vote.name)) {
                            uVote.people.push(vote.name);
                        }
                    });
                });
                const formattedVotes: IEventVotes[] = formatEventVotes(updatedVotes);
                const updatedObject: IEvent = await UpdateEventVoteList(id, formattedVotes);

                return formatVotedEvent(updatedObject);
            } else {
                // console.log("updatedVotes undefined");
                return {id: -1, name: "", dates: []};
            }
            
        }
    }
    //console.log("event undefined");
    return {id: -1, name: "", dates: []};
}

export const VoteToEventVote = (vote: IVote): IEventVotes[] => {
    const eventVotes: IEventVotes[] = vote.votes.map(date => {
        const nameList : string[] = [vote.name]
        return {date: date, people: nameList }
    });

    return eventVotes;
}

const formatEventVotes = (votes: IEventVotes[]): IEventVotes[] => {
    return votes.map(vote => {
        return {date: vote.date, people: vote.people}
    })
}

const formatVotedEvent = (event: IEvent): IEvent => {
    return {id: event.id, name: event.name, dates: event.dates, votes: event.votes?.map(vote => {
        return {date: vote.date, people: vote.people}
    })}
}