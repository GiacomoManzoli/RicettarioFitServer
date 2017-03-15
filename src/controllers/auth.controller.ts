'use strict';
import {CustomError} from "../model/custom-error";

class AuthController {
    static requiresLogin(req, res, next) {
        if (!req.isAuthenticated()) {
            /*isAuthenticated() è un metodo pubblico di passport che ritorna un booleano*/
            let err: any;
            err = new CustomError(401,'Richiesta autenticazione o sessione scaduta');
            next(err);
        }
        else
            next();
    };
}

export = AuthController;



