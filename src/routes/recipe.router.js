'use strict';
var authController = require('../controllers/auth.controller');
var recipeController = require('../controllers/recipe.controller');
function configureRecipeRouter(router) {
    // Recipes
    router.route('/recipes').get(authController.requiresLogin, recipeController.getRecipes);
    router.route('/recipes').post(authController.requiresLogin, recipeController.createRecipe);
    // Recipe
    router.route('/recipes/:id').get(authController.requiresLogin, recipeController.getRecipe);
    router.route('/recipes/:id').delete(authController.requiresLogin, recipeController.deleteRecipe);
}
module.exports = configureRecipeRouter;
//# sourceMappingURL=recipe.router.js.map