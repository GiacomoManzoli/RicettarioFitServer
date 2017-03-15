'use strict';

import {Router} from "express";


let authController = require('../controllers/auth.controller');
let ingredientController = require('../controllers/ingredient.controller');

function  configureMealRouter(router : Router) {
    router.route('/ingredients').get(authController.requiresLogin, ingredientController.getIngredients);
    router.route('/ingredients').post(authController.requiresLogin, ingredientController.createIngredient);
}

export = configureMealRouter;