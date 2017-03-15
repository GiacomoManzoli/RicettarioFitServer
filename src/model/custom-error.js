"use strict";
var CustomError = (function () {
    function CustomError(status, message) {
        this.message = message;
        this.status = status;
    }
    CustomError.prototype.initWithJSON = function (errJson) {
        this.message = errJson.message;
        this.status = errJson.status;
        return this;
    };
    return CustomError;
}());
exports.CustomError = CustomError;
//# sourceMappingURL=custom-error.js.map