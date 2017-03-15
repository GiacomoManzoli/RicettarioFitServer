'use strict';
var authController = require('../controllers/auth.controller');
var mealController = require('../controllers/meal.controller');
function configureMealRouter(router) {
    router.route('/meals').get(authController.requiresLogin, mealController.getMeals);
    router.route('/meals').post(authController.requiresLogin, mealController.createMeal);
    router.route('/meals/:id').get(authController.requiresLogin, mealController.getMeal);
    router.route('/meals/:id').delete(authController.requiresLogin, mealController.deleteMeal);
}
module.exports = configureMealRouter;
//# sourceMappingURL=meals.router.js.map