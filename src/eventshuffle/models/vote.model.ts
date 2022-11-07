import mongoose, { Model, Schema } from 'mongoose';

interface IVote {
    name: string; // Name of the person voting
    votes: Date[]; // Dates for which the person is voting
}

const voteSchema = new Schema<IVote>({
    name: { type: String, required: true},
    votes: {type: [Date], required: true}
});

voteSchema.statics.build = (attr: IVote) => {
    return new VoteModel(attr);
};

interface voteModelInterface extends Model<any> {
    build(attr: IVote): any
}


// MODEL DEFINITION
const VoteModel = mongoose.model<IVote, voteModelInterface>('vote', voteSchema);


// Exports
export { VoteModel, IVote };