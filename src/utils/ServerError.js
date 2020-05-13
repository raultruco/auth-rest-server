export default class ServerError extends Error {
    constructor({ message, status, err }) {
        super();
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
        this.err = err;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServerError)
        }
    }
}
