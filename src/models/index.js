import config from '../config.js';
import mongoose from 'mongoose'

// Configure Mongoose
mongoose.Promise = global.Promise;
// Override 'toJSON' globally renaming "_id" to "id" when serialising to JSON:
// https://stackoverflow.com/a/61184741
const toOptions = {
    virtuals: true,
    versionKey: false,
    transform: (doc, converted) => {
        delete converted._id;
    }
}
mongoose.set('toJSON', toOptions);
mongoose.set('toObject', toOptions);
const connectDb = () => {
    return mongoose.connect(
        `mongodb://${config.mongoServer}:${config.mongoPort}/${config.mongoDatabase}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
  };

export { connectDb, mongoose };
export { default as Member } from './member.model.js';
// Add further model exports here...
