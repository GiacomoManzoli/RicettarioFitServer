'use strict';
import {Meal} from "../model/meal";
import {Ingredient} from "../model/ingredient";
import {MealIngredient} from "../model/meal-ingredient";
import RecipeController = require("./recipe.controller");
import {MealRecipe} from "../model/meal-recipe";
import ErrorController = require("./error.controller");


let { connection , logQuery } = require('../database/database');
let db = connection;


class MealController {

    static retriveMeal(mealId : number, creatorId : number, callback : (Meal) => void) : void {
        let query = `
            SELECT 
                name, tags, description
            FROM 'Meals' 
            WHERE creator=${creatorId} AND id = ${mealId}`;
        logQuery(query);
        let meal;

        db.get(query, function (err, row) {
            //console.log(row);
            if (!err) {
                meal = new Meal();
                meal.id = mealId;
                meal.creator = creatorId;
                meal.name = row["name"];
                meal.tags = row["tags"].split(',').map((x) => x.trim());
                meal.description = row["description"];


                let gotRecipes = false;
                let gotIngredients = false;
                // Retrive dei Recipe
                let recipesQuery = `SELECT recipeId, qty FROM MealsRecipes WHERE mealId = ${meal.id}`;

                db.all(recipesQuery, function (err, rows) {
                    if (!err) {
                        rows.forEach((row) => {
                            RecipeController.retriveRecipe(row["recipeId"], creatorId, (recipe) => {
                                if (recipe) {
                                    let mr = new MealRecipe();
                                    mr.qty = row["qty"];
                                    mr.recipe = recipe;
                                    meal.mealRecipes.push(mr);

                                    gotRecipes = meal.mealRecipes.length == rows.length;
                                    if (gotRecipes) {
                                        console.log(`RETRIVE MEAL - Ho le ricette per ${meal.id}`);

                                    }
                                    if (gotRecipes && gotIngredients) {
                                        callback(meal);
                                    }
                                } else {
                                    console.error(`Non c'è il recipe ${row["recipeId"]}`);
                                    callback(null);
                                }
                            });
                        });
                        if (rows.length == 0) { gotRecipes = true; } // Se il Meal non ha ricette non ci sono callback da aspettare.
                        // e quelle nel forEach non vengono mai invocate.
                    } else {
                        console.error(`Non è stato possibile recuperare il Meal ${row["mealId"]}`);
                        callback(null);
                    }
                });

                // Retrive degli Ingredients del Meal
                let ingredientsQuery = `SELECT
                     mi.mealId, mi.qty, mi.ingredientId,
                     i.name, i.calories, i.caloriesWithFiber, i.carbs, i.proteins, i.fats, i.fibers, i.official,i.user
                     FROM 'MealsIngredients' as mi
                     JOIN Ingredients as i
                     ON i.id = mi.ingredientId
                     WHERE mi.mealId=${meal.id}`;
                logQuery(ingredientsQuery);
                db.all(ingredientsQuery, function (err, ingRows) {
                    if (!err) {
                        ingRows.forEach(row => {
                            let ingredient = new Ingredient().initWithJSON(row);
                            ingredient.id = row["ingredientId"];
                            let mealIngredient = new MealIngredient();
                            mealIngredient.ingredient = ingredient;
                            mealIngredient.qty = row["qty"];
                            meal.mealIngredients.push(mealIngredient);
                        });
                        //console.log(meal);

                        gotIngredients = true;
                        console.log(`RETRIVE MEAL - Ho gli ingredienti per ${meal.id}`);
                        if (gotRecipes && gotIngredients) {
                            callback(meal);
                        }
                    } else {
                        console.error("Non c'è un ingrediente");
                        callback(null);
                    }
                });
            } else {
                console.error("Non c'è il meal");
                callback(null);
            }
        });
    }

    static getMeals(req, res, next) : void {
        let query = `
            SELECT 
                id
            FROM 'Meals' 
            WHERE creator=${req.user.id}`;
        logQuery(query);
        let meals = [];

        db.all(query, function (err, rows) {
            if (!err) {
                console.log(`GET MEALS - Trovate ${rows.length} righe`);
                rows.forEach((row) => {
                    MealController.retriveMeal(row["id"], req.user.id, (meal) =>{
                        if (meal) {
                            meals.push(meal);
                            console.log(`GET MEALS - Meal ${row["id"]} recuperato (${meals.length}/${rows.length})`);
                            if (meals.length == rows.length) { // Tutte le callback sono tornate correttamente
                                res.json(meals);
                            }
                        } else {
                            ErrorController.generateError(9102, `Si è verificato un problema con un recipe del Meals ${row["id"]} di ${req.user.id}`,next);
                        }
                    });
                });
                if (rows.length == 0){
                    res.json([]);
                }
            } else {
                ErrorController.generateError(9100, `Si è verificato un problema con i Meals di ${req.user.id}`,next);
            }
        });


    }

    static getMeal(req, res, next) : void {
        console.log(`GET MEAL - id: ${req.params.id}`);
        MealController.retriveMeal(req.params.id, req.user.id, (meal) => {
            if (meal) {
                res.json(meal);
            } else {
                ErrorController.generateError(9101, `Non è stato possibile recuperare il Meal ${req.params.id}`,next);
            }
        });
    }

    static createMeal(req, res, next) : void {
        //console.log(req.body.meal);
        let mealName = req.body.meal.name;
        let mealDescription = req.body.meal.description;
        let mealTagsString = req.body.meal.tags.join(', ');


        let mealQuery = `INSERT INTO Meals (name, tags, description, creator) `+
            `VALUES ("${mealName}","${mealTagsString}","${mealDescription}", ${req.user.id})`;
        logQuery(mealQuery);

        let mealId = -1;
        db.serialize(function () {
            db.run("BEGIN TRANSACTION");

            let stmt  = db
                .prepare(mealQuery)
                .run(function (err) {
                    mealId = this.lastID;

                    let mealIngredientIds = req.body.meal.mealIngredients.map((x) => x.ingredient.id);
                    let mealIngredientQtys = req.body.meal.mealIngredients.map((x) => x.qty);
                    //console.log(mealIngredientIds);
                    //console.log(mealIngredientQtys);
                    for (let i = 0; i < mealIngredientIds.length; i++) {
                        let ingId = mealIngredientIds[i];
                        let ingQty = mealIngredientQtys[i];
                        let query = `INSERT INTO MealsIngredients(qty, mealId, ingredientId) VALUES (${ingQty}, ${this.lastID}, ${ingId})`;
                        logQuery(query);
                        db.run(query);
                    }

                    let mealRecipeIds = req.body.meal.mealRecipes.map((x) => x.recipe.id);
                    let mealRecipeQtys = req.body.meal.mealRecipes.map((x) => x.qty);
                    //console.log(mealRecipeIds);
                    //console.log(mealRecipeQtys);
                    for (let i = 0; i < mealRecipeIds.length; i++) {
                        let recipeId = mealRecipeIds[i];
                        let recipeQty = mealRecipeQtys[i];
                        let query = `INSERT INTO MealsRecipes(qty, mealId, recipeId) VALUES (${recipeQty}, ${this.lastID}, ${recipeId})`;
                        logQuery(query);
                        db.run(query);
                    }
                });
            db.run("COMMIT", function () {
                res.json({mealId: mealId});
            });
        });

    }

    static deleteMeal(req, res, next) {
        let query = `
            DELETE FROM 'Meals'
            WHERE creator=${req.user.id} AND id = ${req.params.id}`;
        logQuery(query);

        db.run(query, [], function (err) {
            if (!err) {
                res.json({status: 200});
            } else {
                ErrorController.generateError(9103, `Pasto ${req.params.id} di ${req.user.id} non può essere cancellato`, next);
            }
        });
    }
}

export = MealController;
