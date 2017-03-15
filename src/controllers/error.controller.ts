'use strict';
import {CustomError} from "../model/custom-error";

class ErrorController {

    static generateError(code : number, message : string, next) {
        let err: CustomError;
        err = new CustomError(500,`${code} - ${message}`);
        next(err);
    }

}

export = ErrorController;
