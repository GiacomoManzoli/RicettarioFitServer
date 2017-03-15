"use strict";
var recipe_ingredient_1 = require("./recipe-ingredient");
var ingredient_1 = require("./ingredient");
var Recipe = (function () {
    function Recipe() {
        this.id = -1;
        this.name = "";
        this.description = "";
        this.recipeIngredients = [];
    }
    Recipe.prototype.initWithJSON = function (x) {
        var _this = this;
        this.id = x.id;
        this.name = x.name;
        this.description = x.description;
        x.recipeIngredients.forEach(function (ri) {
            var ing = new ingredient_1.Ingredient();
            ing.initWithJSON(ri.ingredient);
            var recipeIngredient = new recipe_ingredient_1.RecipeIngredient(ing);
            recipeIngredient.qty = ri.qty;
            _this.recipeIngredients.push(recipeIngredient);
        });
        return this;
    };
    Object.defineProperty(Recipe.prototype, "calories", {
        get: function () {
            var cals = this.recipeIngredients.reduce(function (par, x) {
                return par + x.ingredient.calories / 100 * x.qty;
            }, 0);
            return cals;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Recipe.prototype, "carbs", {
        get: function () {
            var val = this.recipeIngredients.reduce(function (par, x) {
                return par + x.ingredient.carbs / 100 * x.qty;
            }, 0);
            return val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Recipe.prototype, "proteins", {
        get: function () {
            return this.recipeIngredients.reduce(function (par, x) {
                return par + x.ingredient.proteins / 100 * x.qty;
            }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Recipe.prototype, "fats", {
        get: function () {
            return this.recipeIngredients.reduce(function (par, x) {
                return par + x.ingredient.fats / 100 * x.qty;
            }, 0);
        },
        enumerable: true,
        configurable: true
    });
    return Recipe;
}());
exports.Recipe = Recipe;
//# sourceMappingURL=recipe.js.map