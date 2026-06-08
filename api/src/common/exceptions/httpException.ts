export class HttpException extends Error {
    constructor(
        public readonly statusCode: number,
        message: string
    ) {
        super(message);
        this.name = "HttpException";
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message = "Unauthorized") {
        super(401, message);
        this.name = "UnauthorizedException";
    }
}