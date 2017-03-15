'use strict';
var ingredient_1 = require("../model/ingredient");
var Database = require('../database/database');
var db = Database.connection;
var logQuery = Database.logQuery;
var IngredientController = (function () {
    function IngredientController() {
    }
    IngredientController.getIngredients = function (req, res, next) {
        db.all('SELECT * FROM Ingredients ORDER BY name', function (err, rows) {
            res.json(rows);
        });
    };
    IngredientController.createIngredient = function (req, res, next) {
        var newIngredient = new ingredient_1.Ingredient().initWithJSON(req.body.ingredient);
        newIngredient.official = false;
        newIngredient.user = req.user.id;
        var query = "\n             INSERT INTO Ingredients (name, calories, caloriesWithFiber, carbs, proteins, fats, fibers, official, user)\n             VALUES (\"" + newIngredient.name + "\"," + newIngredient.calories + ", " + newIngredient.caloriesWithFiber + "," + newIngredient.carbs + "," + newIngredient.proteins + "," + newIngredient.fats + ", " + newIngredient.fibers + ", 0, " + newIngredient.user + ")\n            ";
        logQuery(query);
        var ingredientId = -1;
        db.serialize(function () {
            db.run("BEGIN TRANSACTION");
            var stmt = db
                .prepare(query)
                .run(function (err) {
                ingredientId = this.lastID;
            });
            db.run("COMMIT", function () {
                res.json({ ingredientId: ingredientId });
            });
        });
    };
    return IngredientController;
}());
module.exports = IngredientController;
//# sourceMappingURL=ingredient.controller.js.map