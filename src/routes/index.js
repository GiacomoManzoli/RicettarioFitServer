'use strict';
var db = require('../database/database').connection;
var authController = require('../controllers/auth.controller');
function configureRouter(router) {
    /* GET home page. */
    router.get('/ping', function (req, res, next) {
        res.json({
            status: 'pong'
        });
    });
    router.get('/users', function (req, res, next) {
        db.all('SELECT * FROM Users', function (err, rows) {
            res.json(rows);
        });
    });
    router.route('/alim2').get(authController.requiresLogin, function (req, res, next) {
        db.all('SELECT * FROM Ingredients', function (err, rows) {
            res.json(rows);
        });
    });
    var userConfiguartor = require('./user.router');
    userConfiguartor(router);
    var recipeConfigurator = require('./recipe.router');
    recipeConfigurator(router);
    var mealConfigurator = require('./meals.router');
    mealConfigurator(router);
    var ingredientConfigurator = require('./ingredients.router');
    ingredientConfigurator(router);
    router.get('/', function (req, res, next) {
        res.sendfile('./public/index.html');
    });
}
module.exports = configureRouter;
//# sourceMappingURL=index.js.map