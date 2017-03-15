'use strict';

import {Router} from "express";
let db = require('../database/database').connection;
let authController = require('../controllers/auth.controller');


function configureRouter(router : Router) {
    /* GET home page. */


    router.get('/ping', function(req, res, next) {
        res.json({
            status : 'pong'
        });
    });

    router.get('/users', function (req, res, next) {
        db.all('SELECT * FROM Users', function(err, rows) {
            res.json(rows);
        });
    });

    router.route('/alim2').get(authController.requiresLogin, function (req, res, next) {
        db.all('SELECT * FROM Ingredients', function(err, rows) {
            res.json(rows);
        });
    });


    let userConfiguartor = require('./user.router');
    userConfiguartor(router);
    let recipeConfigurator = require('./recipe.router');
    recipeConfigurator(router);
    let mealConfigurator = require('./meals.router');
    mealConfigurator(router);
    let ingredientConfigurator = require('./ingredients.router');
    ingredientConfigurator(router);

    router.get('/', function(req, res, next) {
        res.sendfile('./public/index.html');
    });

}

export = configureRouter;