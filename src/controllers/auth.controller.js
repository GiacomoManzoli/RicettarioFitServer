'use strict';
var custom_error_1 = require("../model/custom-error");
var AuthController = (function () {
    function AuthController() {
    }
    AuthController.requiresLogin = function (req, res, next) {
        if (!req.isAuthenticated()) {
            /*isAuthenticated() è un metodo pubblico di passport che ritorna un booleano*/
            var err = void 0;
            err = new custom_error_1.CustomError(401, 'Richiesta autenticazione o sessione scaduta');
            next(err);
        }
        else
            next();
    };
    ;
    return AuthController;
}());
module.exports = AuthController;
//# sourceMappingURL=auth.controller.js.map