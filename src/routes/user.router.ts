'use strict';

import {Router} from "express";

let userController = require('../controllers/user.controller');
let authController = require('../controllers/auth.controller');


function  configureUserRouter(router : Router) {
    router.post('/signup', userController.signUp);
    router.post('/signin', userController.signIn);
    router.route('/signout').get(authController.requiresLogin, userController.signOut);
}

export = configureUserRouter;