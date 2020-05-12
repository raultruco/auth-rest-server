export default class ServerError extends Error {
    constructor({ message, status }) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, ServerError);
    }
}
