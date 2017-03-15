export class CustomError{
    message : string;
    status : number;

    constructor( status : number, message : string) {
        this.message = message;
        this.status = status;
    }

    initWithJSON(errJson: any) {
        this.message = errJson.message;
        this.status = errJson.status;
        return this;
    }
}