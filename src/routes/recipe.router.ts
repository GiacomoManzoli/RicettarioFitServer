'use strict';

import {Router} from "express";


let authController = require('../controllers/auth.controller');
let recipeController = require('../controllers/recipe.controller');

function  configureRecipeRouter(router : Router) {
    // Recipes
    router.route('/recipes').get(authController.requiresLogin, recipeController.getRecipes);
    router.route('/recipes').post(authController.requiresLogin, recipeController.createRecipe);

    // Recipe
    router.route('/recipes/:id').get(authController.requiresLogin, recipeController.getRecipe);
    router.route('/recipes/:id').delete(authController.requiresLogin, recipeController.deleteRecipe)

}

export = configureRecipeRouter;