'use strict';
var authController = require('../controllers/auth.controller');
var ingredientController = require('../controllers/ingredient.controller');
function configureMealRouter(router) {
    router.route('/ingredients').get(authController.requiresLogin, ingredientController.getIngredients);
    router.route('/ingredients').post(authController.requiresLogin, ingredientController.createIngredient);
}
module.exports = configureMealRouter;
//# sourceMappingURL=ingredients.router.js.map