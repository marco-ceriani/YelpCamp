
class ServerError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = 'ServerError';
        this.statusCode = statusCode;
    }
}

class ValidationError extends ServerError {
    constructor(message) {
        super(422, message);
        this.name = 'ValidationError';
    }
}

module.exports = {
    ServerError,
    ValidationError
}
