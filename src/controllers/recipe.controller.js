'use strict';
var recipe_1 = require("../model/recipe");
var recipe_ingredient_1 = require("../model/recipe-ingredient");
var ingredient_1 = require("../model/ingredient");
var ErrorController = require("./error.controller");
var _a = require('../database/database'), connection = _a.connection, logQuery = _a.logQuery;
var db = connection;
var RecipeController = (function () {
    function RecipeController() {
    }
    RecipeController.retriveRecipe = function (recipeId, creatorId, callback) {
        var query = "\n            SELECT \n                name, description\n            FROM 'Recipes' \n            WHERE creator=" + creatorId + " AND id = " + recipeId;
        logQuery(query);
        var recipe;
        db.get(query, function (err, row) {
            console.log("retriveRecipe - got recipe name");
            if (!err) {
                recipe = new recipe_1.Recipe();
                recipe.id = recipeId;
                recipe.creator = creatorId;
                recipe.name = row["name"];
                recipe.description = row["description"];
                var query2 = "SELECT\n                     ri.recipeId, ri.qty, ri.ingredientId,\n                     i.name, i.calories, i.caloriesWithFiber, i.carbs, i.proteins, i.fats, i.fibers, i.official,i.user\n                     FROM 'RecipesIngredients' as ri\n                     JOIN Ingredients as i\n                     ON i.id = ri.ingredientId\n                     WHERE ri.recipeId=" + recipe.id;
                logQuery(query2);
                db.all(query2, function (err, ingRows) {
                    if (!err) {
                        ingRows.forEach(function (row) {
                            var ingredient = new ingredient_1.Ingredient();
                            ingredient.initWithJSON(row);
                            ingredient.id = row["ingredientId"];
                            var recipeIngredient = new recipe_ingredient_1.RecipeIngredient(ingredient);
                            recipeIngredient.qty = row["qty"];
                            recipe.recipeIngredients.push(recipeIngredient);
                        });
                        //console.log(recipe);
                        callback(recipe);
                    }
                });
            }
            else {
                callback(null);
            }
        });
    };
    RecipeController.getRecipes = function (req, res, next) {
        var query = "\n            SELECT \n                id\n            FROM 'Recipes' \n            WHERE creator=" + req.user.id;
        logQuery(query);
        db.all(query, function (err, rows) {
            if (!err) {
                var callbackCount_1 = rows.length;
                var recipes_1 = [];
                rows.forEach(function (row) {
                    RecipeController.retriveRecipe(row["id"], req.user.id, function (recipe) {
                        if (recipe) {
                            recipes_1.push(recipe);
                            callbackCount_1--;
                            if (callbackCount_1 == 0) {
                                //console.log(recipes);
                                res.json(recipes_1);
                            }
                        }
                        else {
                            ErrorController.generateError(9000, "Si \u00E8 verificato un problema con i Recipe di " + req.user.id, next);
                        }
                    });
                });
                if (callbackCount_1 == 0) {
                    res.json([]);
                }
            }
        });
    };
    RecipeController.getRecipe = function (req, res, next) {
        //console.log(req.params);
        var id = req.params.id;
        RecipeController.retriveRecipe(id, req.user.id, function (recipe) {
            if (recipe != null) {
                res.json(recipe);
            }
            else {
                ErrorController.generateError(9001, "Recipe " + id + " di " + req.user.id + " non trovato", next);
            }
        });
    };
    RecipeController.createRecipe = function (req, res, next) {
        //console.log(req.body);
        var recipeName = req.body.recipe.name;
        var recipeDescription = req.body.recipe.description;
        //console.log(req.body.recipe);
        var recipeIngredientIds = req.body.recipe.recipeIngredients.map(function (x) { return x.ingredient.id; });
        var recipeIngredientQtys = req.body.recipe.recipeIngredients.map(function (x) { return x.qty; });
        //console.log(recipeIngredientIds);
        //console.log(recipeIngredientQtys);
        var recipeQuery = "INSERT INTO Recipes (name, description, creator) " +
            ("VALUES (\"" + recipeName + "\",\"" + recipeDescription + "\", " + req.user.id + ")");
        logQuery(recipeQuery);
        var recipeId = -1;
        db.serialize(function () {
            db.run("BEGIN TRANSACTION");
            var stmt = db
                .prepare(recipeQuery)
                .run(function (err) {
                recipeId = this.lastID;
                for (var i = 0; i < recipeIngredientIds.length; i++) {
                    var ingId = recipeIngredientIds[i];
                    var ingQty = recipeIngredientQtys[i];
                    var query = "INSERT INTO RecipesIngredients(qty, recipeId, ingredientId) VALUES (" + ingQty + ", " + this.lastID + ", " + ingId + ")";
                    logQuery(query);
                    db.run(query);
                }
            });
            db.run("COMMIT", function () {
                res.json({ recipeId: recipeId });
            });
        });
    };
    RecipeController.deleteRecipe = function (req, res, next) {
        var query = "\n            DELETE FROM 'Recipes'\n            WHERE creator=" + req.user.id + " AND id = " + req.params.id;
        logQuery(query);
        db.run(query, [], function (err) {
            console.log(err);
            if (!err) {
                res.json({ status: 200 });
            }
            else {
                ErrorController.generateError(9002, "Recipe " + req.params.id + " di " + req.user.id + " non pu\u00F2 essere cancellato", next);
            }
        });
    };
    return RecipeController;
}());
module.exports = RecipeController;
//# sourceMappingURL=recipe.controller.js.map