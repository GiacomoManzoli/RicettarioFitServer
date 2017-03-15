'use strict';
var custom_error_1 = require("../model/custom-error");
var ErrorController = (function () {
    function ErrorController() {
    }
    ErrorController.generateError = function (code, message, next) {
        var err;
        err = new custom_error_1.CustomError(500, code + " - " + message);
        next(err);
    };
    return ErrorController;
}());
module.exports = ErrorController;
//# sourceMappingURL=error.controller.js.map