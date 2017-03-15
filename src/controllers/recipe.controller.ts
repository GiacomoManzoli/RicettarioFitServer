'use strict';
import {Recipe} from "../model/recipe";
import {RecipeIngredient} from "../model/recipe-ingredient";
import {Ingredient} from "../model/ingredient";
import ErrorController = require("./error.controller");


let { connection , logQuery } = require('../database/database');
let db = connection;


class RecipeController {

    static retriveRecipe(recipeId : number, creatorId : number, callback : (Recipe) => void) : void {
        let query = `
            SELECT 
                name, description
            FROM 'Recipes' 
            WHERE creator=${creatorId} AND id = ${recipeId}`;
        logQuery(query);
        let recipe;

        db.get(query, function (err, row) {
            console.log("retriveRecipe - got recipe name");
            if ( !err ) {
                recipe = new Recipe();
                recipe.id = recipeId;
                recipe.creator = creatorId;
                recipe.name = row["name"];
                recipe.description = row["description"];


                let query2 = `SELECT
                     ri.recipeId, ri.qty, ri.ingredientId,
                     i.name, i.calories, i.caloriesWithFiber, i.carbs, i.proteins, i.fats, i.fibers, i.official,i.user
                     FROM 'RecipesIngredients' as ri
                     JOIN Ingredients as i
                     ON i.id = ri.ingredientId
                     WHERE ri.recipeId=${recipe.id}`;
                logQuery(query2);
                db.all(query2, function (err, ingRows) {
                    if (!err) {
                        ingRows.forEach(row => {
                            let ingredient = new Ingredient();
                            ingredient.initWithJSON(row);
                            ingredient.id = row["ingredientId"];
                            let recipeIngredient = new RecipeIngredient(ingredient);
                            recipeIngredient.qty = row["qty"];
                            recipe.recipeIngredients.push(recipeIngredient);
                        });
                        //console.log(recipe);
                        callback(recipe);
                    }
                });
            } else {
                callback(null);
            }
        });
    }


    static getRecipes(req, res, next) : void {
        let query = `
            SELECT 
                id
            FROM 'Recipes' 
            WHERE creator=${req.user.id}`;
        logQuery(query);

        db.all(query, function (err, rows) {
            if (!err) {

                let callbackCount = rows.length;
                let recipes = [];

                rows.forEach((row) => {
                    RecipeController.retriveRecipe(row["id"], req.user.id, (recipe) => {
                        if (recipe) {
                            recipes.push(recipe);
                            callbackCount--;

                            if (callbackCount == 0){
                                //console.log(recipes);
                                res.json(recipes);
                            }
                        } else {
                            ErrorController.generateError(9000, `Si è verificato un problema con i Recipe di ${req.user.id}`, next);
                        }
                    });
                });

                if (callbackCount == 0){
                    res.json([]);
                }
            }
        });
    }

    static getRecipe(req, res, next) : void {
        //console.log(req.params);
        let id = req.params.id;
        RecipeController.retriveRecipe(id, req.user.id, (recipe) => {
            if (recipe != null) {
                res.json(recipe);
            } else {
                ErrorController.generateError(9001, `Recipe ${id} di ${req.user.id} non trovato`, next);
            }
        });
    }

    static createRecipe(req, res, next) : void {
        //console.log(req.body);
        let recipeName = req.body.recipe.name;
        let recipeDescription = req.body.recipe.description;

        //console.log(req.body.recipe);

        let recipeIngredientIds = req.body.recipe.recipeIngredients.map((x) => x.ingredient.id);
        let recipeIngredientQtys = req.body.recipe.recipeIngredients.map((x) => x.qty);

        //console.log(recipeIngredientIds);
        //console.log(recipeIngredientQtys);

        let recipeQuery = `INSERT INTO Recipes (name, description, creator) `+
            `VALUES ("${recipeName}","${recipeDescription}", ${req.user.id})`;
        logQuery(recipeQuery);

        let recipeId = -1;
        db.serialize(function () {
            db.run("BEGIN TRANSACTION");

            let stmt = db
                .prepare(recipeQuery)
                .run(function (err) {
                    recipeId = this.lastID;
                    for (let i = 0; i < recipeIngredientIds.length; i++) {
                        let ingId = recipeIngredientIds[i];
                        let ingQty = recipeIngredientQtys[i];
                        let query = `INSERT INTO RecipesIngredients(qty, recipeId, ingredientId) VALUES (${ingQty}, ${this.lastID}, ${ingId})`;
                        logQuery(query);

                        db.run(query);
                    }
                });
            db.run("COMMIT", function () {
                res.json({recipeId: recipeId});
            });
        });

    }

    static deleteRecipe(req, res, next) {
        let query = `
            DELETE FROM 'Recipes'
            WHERE creator=${req.user.id} AND id = ${req.params.id}`;
        logQuery(query);

        db.run(query, [], function (err) {
            console.log(err);
            if (!err) {
                res.json({status: 200});
            } else {
                ErrorController.generateError(9002, `Recipe ${req.params.id} di ${req.user.id} non può essere cancellato`, next);
            }
        });
    }
}

export = RecipeController;
