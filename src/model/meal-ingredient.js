"use strict";
var ingredient_1 = require("./ingredient");
var MealIngredient = (function () {
    function MealIngredient() {
    }
    MealIngredient.prototype.initWithJSON = function (json) {
        this.ingredient = new ingredient_1.Ingredient().initWithJSON(json.ingredient);
        this.qty = json.qty;
        return this;
    };
    return MealIngredient;
}());
exports.MealIngredient = MealIngredient;
//# sourceMappingURL=meal-ingredient.js.map