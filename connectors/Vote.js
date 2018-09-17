import Mongoose from "mongoose";

Mongoose.Promise = global.Promise;
const mongo = Mongoose.connect('mongodb://localhost/votes', {
    useMongoClient: true
});

const VoteSchema = Mongoose.Schema({
    postId: Number,
    votes: Number,
});

const Vote = Mongoose.model('votes', VoteSchema);

export { Vote };