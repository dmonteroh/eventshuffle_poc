import e from "express";
import mongoose, { HydratedDocument } from "mongoose";
import { json } from "stream/consumers";
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
            if (updatedVotes != undefined) {
                
                // this is bad practice for cloning objects, a proper deep clone function is recommended
                // but I don't think using something like lodash for a small project like this is worth it
                // also didn't want to use someone elses code.
                const beforeUpdate: IEventVotes[] = JSON.parse(JSON.stringify(formatEventVotes(updatedVotes)));
                
                // map felt uncomfortable to use, maybe just rusty
                // loop could be performed by a mongodb query, but need to evaluate efficiency
                eventVotes.forEach(eVote => {
                    updatedVotes?.forEach(uVote => {
                        if (uVote.date.valueOf() == eVote.date.valueOf() && !uVote.people.includes(vote.name)) {
                            uVote.people.push(vote.name);
                        }
                    });
                });
                const formattedVotes: IEventVotes[] = formatEventVotes(updatedVotes);

                const voteLength = formattedVotes.length === beforeUpdate.length ? true : false;
                const sameVotes = countVotes(formattedVotes, beforeUpdate)
                
                // In general, this approach can also be solved by taking a more SQL approach
                // if I saved the EventID in the Vote, there would be no need to make this,
                // that's the nice thing about relationships.
                // I am making this choice simply for showing that I can get around NoSQL and
                // arbitraty rules with code. This is something I would begrudgingly push to prod
                if(!voteLength || !sameVotes) {
                    await vote.save().then((savedDoc: IVote) => {
                        savedDoc === vote;
                        console.log("saved the vote");
                        
                    });
                    if (mongoose.isValidObjectId(vote._id)) {
                        const updatedObject: IEvent = await UpdateEventVoteList(id, formattedVotes);
                        return formatVotedEvent(updatedObject);
                    }
                    
                } else {
                    return formatVotedEvent(event);
                }
            } else {
                throw new Error("Could not fetch votes of event before casting vote")
            }
            
        }
    }
    throw new Error("Could not fetch event before casting vote")
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

const countVotes = (updated: IEventVotes[], old: IEventVotes[]): boolean => {
    // again, there are better ways to do this. JSON.stringify is fragile and a more
    // precise comparison should be made for bigger objects.
    console.log(JSON.stringify(updated));
    console.log(JSON.stringify(old));
    
    return JSON.stringify(updated) === JSON.stringify(old);
}