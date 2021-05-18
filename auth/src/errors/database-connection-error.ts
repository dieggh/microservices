import { CustomError  } from './custom-error';

export class DatabaseConnectionError extends CustomError {
    
    reason = "no connection to databasee";
    statusCode = 500;

    constructor(){
        super('Error connection to db');

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors(): { message: string, field?: string } []{
        return [
            {
                message: this.reason
            }
        ]
    }

}