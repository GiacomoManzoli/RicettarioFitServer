'use strict';
var meal_1 = require("../model/meal");
var ingredient_1 = require("../model/ingredient");
var meal_ingredient_1 = require("../model/meal-ingredient");
var RecipeController = require("./recipe.controller");
var meal_recipe_1 = require("../model/meal-recipe");
var ErrorController = require("./error.controller");
var _a = require('../database/database'), connection = _a.connection, logQuery = _a.logQuery;
var db = connection;
var MealController = (function () {
    function MealController() {
    }
    MealController.retriveMeal = function (mealId, creatorId, callback) {
        var query = "\n            SELECT \n                name, tags, description\n            FROM 'Meals' \n            WHERE creator=" + creatorId + " AND id = " + mealId;
        logQuery(query);
        var meal;
        db.get(query, function (err, row) {
            //console.log(row);
            if (!err) {
                meal = new meal_1.Meal();
                meal.id = mealId;
                meal.creator = creatorId;
                meal.name = row["name"];
                meal.tags = row["tags"].split(',').map(function (x) { return x.trim(); });
                meal.description = row["description"];
                var gotRecipes_1 = false;
                var gotIngredients_1 = false;
                // Retrive dei Recipe
                var recipesQuery = "SELECT recipeId, qty FROM MealsRecipes WHERE mealId = " + meal.id;
                db.all(recipesQuery, function (err, rows) {
                    if (!err) {
                        rows.forEach(function (row) {
                            RecipeController.retriveRecipe(row["recipeId"], creatorId, function (recipe) {
                                if (recipe) {
                                    var mr = new meal_recipe_1.MealRecipe();
                                    mr.qty = row["qty"];
                                    mr.recipe = recipe;
                                    meal.mealRecipes.push(mr);
                                    gotRecipes_1 = meal.mealRecipes.length == rows.length;
                                    if (gotRecipes_1) {
                                        console.log("RETRIVE MEAL - Ho le ricette per " + meal.id);
                                    }
                                    if (gotRecipes_1 && gotIngredients_1) {
                                        callback(meal);
                                    }
                                }
                                else {
                                    console.error("Non c'\u00E8 il recipe " + row["recipeId"]);
                                    callback(null);
                                }
                            });
                        });
                        if (rows.length == 0) {
                            gotRecipes_1 = true;
                        } // Se il Meal non ha ricette non ci sono callback da aspettare.
                    }
                    else {
                        console.error("Non \u00E8 stato possibile recuperare il Meal " + row["mealId"]);
                        callback(null);
                    }
                });
                // Retrive degli Ingredients del Meal
                var ingredientsQuery = "SELECT\n                     mi.mealId, mi.qty, mi.ingredientId,\n                     i.name, i.calories, i.caloriesWithFiber, i.carbs, i.proteins, i.fats, i.fibers, i.official,i.user\n                     FROM 'MealsIngredients' as mi\n                     JOIN Ingredients as i\n                     ON i.id = mi.ingredientId\n                     WHERE mi.mealId=" + meal.id;
                logQuery(ingredientsQuery);
                db.all(ingredientsQuery, function (err, ingRows) {
                    if (!err) {
                        ingRows.forEach(function (row) {
                            var ingredient = new ingredient_1.Ingredient().initWithJSON(row);
                            ingredient.id = row["ingredientId"];
                            var mealIngredient = new meal_ingredient_1.MealIngredient();
                            mealIngredient.ingredient = ingredient;
                            mealIngredient.qty = row["qty"];
                            meal.mealIngredients.push(mealIngredient);
                        });
                        //console.log(meal);
                        gotIngredients_1 = true;
                        console.log("RETRIVE MEAL - Ho gli ingredienti per " + meal.id);
                        if (gotRecipes_1 && gotIngredients_1) {
                            callback(meal);
                        }
                    }
                    else {
                        console.error("Non c'è un ingrediente");
                        callback(null);
                    }
                });
            }
            else {
                console.error("Non c'è il meal");
                callback(null);
            }
        });
    };
    MealController.getMeals = function (req, res, next) {
        var query = "\n            SELECT \n                id\n            FROM 'Meals' \n            WHERE creator=" + req.user.id;
        logQuery(query);
        var meals = [];
        db.all(query, function (err, rows) {
            if (!err) {
                console.log("GET MEALS - Trovate " + rows.length + " righe");
                rows.forEach(function (row) {
                    MealController.retriveMeal(row["id"], req.user.id, function (meal) {
                        if (meal) {
                            meals.push(meal);
                            console.log("GET MEALS - Meal " + row["id"] + " recuperato (" + meals.length + "/" + rows.length + ")");
                            if (meals.length == rows.length) {
                                res.json(meals);
                            }
                        }
                        else {
                            ErrorController.generateError(9102, "Si \u00E8 verificato un problema con un recipe del Meals " + row["id"] + " di " + req.user.id, next);
                        }
                    });
                });
                if (rows.length == 0) {
                    res.json([]);
                }
            }
            else {
                ErrorController.generateError(9100, "Si \u00E8 verificato un problema con i Meals di " + req.user.id, next);
            }
        });
    };
    MealController.getMeal = function (req, res, next) {
        console.log("GET MEAL - id: " + req.params.id);
        MealController.retriveMeal(req.params.id, req.user.id, function (meal) {
            if (meal) {
                res.json(meal);
            }
            else {
                ErrorController.generateError(9101, "Non \u00E8 stato possibile recuperare il Meal " + req.params.id, next);
            }
        });
    };
    MealController.createMeal = function (req, res, next) {
        //console.log(req.body.meal);
        var mealName = req.body.meal.name;
        var mealDescription = req.body.meal.description;
        var mealTagsString = req.body.meal.tags.join(', ');
        var mealQuery = "INSERT INTO Meals (name, tags, description, creator) " +
            ("VALUES (\"" + mealName + "\",\"" + mealTagsString + "\",\"" + mealDescription + "\", " + req.user.id + ")");
        logQuery(mealQuery);
        var mealId = -1;
        db.serialize(function () {
            db.run("BEGIN TRANSACTION");
            var stmt = db
                .prepare(mealQuery)
                .run(function (err) {
                mealId = this.lastID;
                var mealIngredientIds = req.body.meal.mealIngredients.map(function (x) { return x.ingredient.id; });
                var mealIngredientQtys = req.body.meal.mealIngredients.map(function (x) { return x.qty; });
                //console.log(mealIngredientIds);
                //console.log(mealIngredientQtys);
                for (var i = 0; i < mealIngredientIds.length; i++) {
                    var ingId = mealIngredientIds[i];
                    var ingQty = mealIngredientQtys[i];
                    var query = "INSERT INTO MealsIngredients(qty, mealId, ingredientId) VALUES (" + ingQty + ", " + this.lastID + ", " + ingId + ")";
                    logQuery(query);
                    db.run(query);
                }
                var mealRecipeIds = req.body.meal.mealRecipes.map(function (x) { return x.recipe.id; });
                var mealRecipeQtys = req.body.meal.mealRecipes.map(function (x) { return x.qty; });
                //console.log(mealRecipeIds);
                //console.log(mealRecipeQtys);
                for (var i = 0; i < mealRecipeIds.length; i++) {
                    var recipeId = mealRecipeIds[i];
                    var recipeQty = mealRecipeQtys[i];
                    var query = "INSERT INTO MealsRecipes(qty, mealId, recipeId) VALUES (" + recipeQty + ", " + this.lastID + ", " + recipeId + ")";
                    logQuery(query);
                    db.run(query);
                }
            });
            db.run("COMMIT", function () {
                res.json({ mealId: mealId });
            });
        });
    };
    MealController.deleteMeal = function (req, res, next) {
        var query = "\n            DELETE FROM 'Meals'\n            WHERE creator=" + req.user.id + " AND id = " + req.params.id;
        logQuery(query);
        db.run(query, [], function (err) {
            if (!err) {
                res.json({ status: 200 });
            }
            else {
                ErrorController.generateError(9103, "Pasto " + req.params.id + " di " + req.user.id + " non pu\u00F2 essere cancellato", next);
            }
        });
    };
    return MealController;
}());
module.exports = MealController;
//# sourceMappingURL=meal.controller.js.map