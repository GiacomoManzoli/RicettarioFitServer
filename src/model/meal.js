"use strict";
var meal_recipe_1 = require("./meal-recipe");
var meal_ingredient_1 = require("./meal-ingredient");
var Meal = (function () {
    function Meal() {
        this.tags = [];
        this.mealIngredients = [];
        this.mealRecipes = [];
    }
    Meal.prototype.initWithJSON = function (x) {
        var _this = this;
        this.id = x.id;
        this.tags = x.tags;
        this.description = x.description;
        this.creator = x.creator;
        this.name = x.name;
        x.mealRecipes.forEach(function (mr) {
            var o = new meal_recipe_1.MealRecipe().initWithJSON(mr);
            _this.mealRecipes.push(o);
        });
        x.mealIngredients.forEach(function (mi) {
            var o = new meal_ingredient_1.MealIngredient().initWithJSON(mi);
            _this.mealIngredients.push(o);
        });
        return this;
    };
    Object.defineProperty(Meal.prototype, "calories", {
        get: function () {
            var val = this.mealIngredients.reduce(function (par, x) {
                return par + x.ingredient.calories / 100 * x.qty;
            }, 0);
            val = this.mealRecipes.reduce(function (par, x) {
                return par + x.recipe.calories * x.qty;
            }, val);
            return val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Meal.prototype, "carbs", {
        get: function () {
            var val = this.mealIngredients.reduce(function (par, x) {
                return par + x.ingredient.carbs / 100 * x.qty;
            }, 0);
            val = this.mealRecipes.reduce(function (par, x) {
                return par + x.recipe.carbs * x.qty;
            }, val);
            return val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Meal.prototype, "proteins", {
        get: function () {
            var val = this.mealIngredients.reduce(function (par, x) {
                return par + x.ingredient.proteins / 100 * x.qty;
            }, 0);
            val = this.mealRecipes.reduce(function (par, x) {
                return par + x.recipe.proteins * x.qty;
            }, val);
            return val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Meal.prototype, "fats", {
        get: function () {
            var val = this.mealIngredients.reduce(function (par, x) {
                return par + x.ingredient.fats / 100 * x.qty;
            }, 0);
            val = this.mealRecipes.reduce(function (par, x) {
                return par + x.recipe.fats * x.qty;
            }, val);
            return val;
        },
        enumerable: true,
        configurable: true
    });
    return Meal;
}());
exports.Meal = Meal;
//# sourceMappingURL=meal.js.map