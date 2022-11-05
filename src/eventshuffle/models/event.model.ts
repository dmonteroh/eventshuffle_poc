import mongoose, { Model, Schema } from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);


// EVENT VOTES OBJECT
interface IEventVotes {
    people: string[]; // List of people who have voted
    date: Date; // Date for which it was voted
}

// EVENT OBJECT
interface IEvent {
    id?: number; // Sequential ID
    name: string; // Name of the Event
    dates: Date[]; // Possible dates for the Event
    votes?: IEventVotes[]; // Votes casted for an Event
}

// Interfaces for matching expecting result output only
interface IEventL {
    id?: number;
    name: string;
}

interface IResult {
    id?: number;
    name: string;
    suitableDates: IEventVotes[];
}

// MongoDB
const eventVoteSchema = new Schema<IEventVotes>({
    people: { type: [String], required: true},
    date: {type: Date, required: true}
})

eventVoteSchema.statics.build = (attr: IEventVotes) => {
    return new EventVoteModel(attr);
}

interface eventVoteModelInterface extends Model<any> {
    build(attr: IEventVotes): any
}

const eventSchema = new Schema<IEvent>({
    id:   {type: Number, required: true},
    name: { type: String, required: true},
    dates: { type: [Date], required: true},
    votes: {type: [eventVoteSchema], required: false}
})
eventSchema.plugin(AutoIncrement, {inc_field: 'id', start_seq: 0})

eventSchema.statics.build = (attr: IEvent) => {
    return new EventModel(attr);
};

interface eventModelInterface extends Model<any> {
    build(attr: IEvent): any
}


// MODEL DEFINITION
const EventModel = mongoose.model<IEvent, eventModelInterface>('event', eventSchema);
const EventVoteModel = mongoose.model<IEventVotes, eventVoteModelInterface>('eventVote', eventVoteSchema);

// Exports
export { EventModel, EventVoteModel, IEvent, IEventL, IEventVotes, IResult };