export interface ValidationError {
    field: string;
    message: string;
}

export class ApiRequestError extends Error {
    public status: number;
    public errors?: ValidationError[];

    constructor(message: string, status: number, errors?: ValidationError[]) {
        super(message);
        this.status = status;
        this.errors = errors;
        Object.setPrototypeOf(this, ApiRequestError.prototype);
    }
}