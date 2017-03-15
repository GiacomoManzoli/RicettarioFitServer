"use strict";
var Ingredient = (function () {
    function Ingredient() {
        this.id = -1;
        this.name = "";
        this.calories = 0;
        this.caloriesWithFiber = 0;
        this.carbs = 0;
        this.fats = 0;
        this.proteins = 0;
        this.fibers = 0;
        this.official = false;
        this.user = -1;
    }
    Ingredient.prototype.initWithJSON = function (json) {
        this.id = json["id"];
        this.name = json["name"];
        this.calories = json["calories"];
        this.caloriesWithFiber = json["caloriesWithFiber"];
        this.carbs = json["carbs"];
        this.proteins = json["proteins"];
        this.fats = json["fats"];
        this.fibers = json["fibers"];
        this.official = json["official"];
        this.user = json["user"];
        return this;
    };
    return Ingredient;
}());
exports.Ingredient = Ingredient;
//# sourceMappingURL=ingredient.js.map