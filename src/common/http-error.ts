import HTTP_STATUS_CODES from 'readable-http-codes';

export class HttpError extends Error {
    constructor(public readonly code: (typeof HTTP_STATUS_CODES)[keyof typeof HTTP_STATUS_CODES], message: string) {
        super(message);
    }
};
