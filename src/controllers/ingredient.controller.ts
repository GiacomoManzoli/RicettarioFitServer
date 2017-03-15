'use strict';
import {Ingredient} from "../model/ingredient";
let Database = require('../database/database');

let db = Database.connection;
let logQuery = Database.logQuery;

class IngredientController {
    static getIngredients(req, res, next) : void {
        db.all('SELECT * FROM Ingredients ORDER BY name', function(err, rows) {
            res.json(rows);
        });
    }

    static createIngredient(req, res, next) : void {
        let newIngredient = new Ingredient().initWithJSON(req.body.ingredient);
        newIngredient.official = false;
        newIngredient.user = req.user.id;

        let query = `
             INSERT INTO Ingredients (name, calories, caloriesWithFiber, carbs, proteins, fats, fibers, official, user)
             VALUES ("${newIngredient.name}",${newIngredient.calories}, ${newIngredient.caloriesWithFiber},${newIngredient.carbs},${newIngredient.proteins},${newIngredient.fats}, ${newIngredient.fibers}, 0, ${newIngredient.user})
            `;
        logQuery(query);

        let ingredientId = -1;
        db.serialize(function () {
            db.run("BEGIN TRANSACTION");
            let stmt  = db
                .prepare(query)
                .run(function (err) {
                    ingredientId = this.lastID;
                });
            db.run("COMMIT", function () {
                res.json({ingredientId: ingredientId});
            });
        });
    }
}

export = IngredientController;