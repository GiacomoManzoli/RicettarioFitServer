'use strict';

import {Router} from "express";


let authController = require('../controllers/auth.controller');
let mealController = require('../controllers/meal.controller');

function  configureMealRouter(router : Router) {

    router.route('/meals').get(authController.requiresLogin, mealController.getMeals);
    router.route('/meals').post(authController.requiresLogin, mealController.createMeal);

    router.route('/meals/:id').get(authController.requiresLogin, mealController.getMeal);
    router.route('/meals/:id').delete(authController.requiresLogin, mealController.deleteMeal);
}

export = configureMealRouter;