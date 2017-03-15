"use strict";
var recipe_1 = require("./recipe");
var MealRecipe = (function () {
    function MealRecipe() {
    }
    MealRecipe.prototype.initWithJSON = function (json) {
        this.recipe = new recipe_1.Recipe().initWithJSON(json.recipe);
        this.qty = json.qty;
        return this;
    };
    return MealRecipe;
}());
exports.MealRecipe = MealRecipe;
//# sourceMappingURL=meal-recipe.js.map