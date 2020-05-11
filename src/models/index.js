import config from '../config.js';
import mongoose from 'mongoose'

// Configure Mongoose
mongoose.Promise = global.Promise;
const connectDb = () => {
    return mongoose.connect(
        `mongodb://${config.mongoServer}:${config.mongoPort}/${config.mongoDatabase}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
  };

export { connectDb, mongoose };
export { default as Member } from './member.model.js';
// Add further model exports here...
