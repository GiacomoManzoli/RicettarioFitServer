'use strict';
var userController = require('../controllers/user.controller');
var authController = require('../controllers/auth.controller');
function configureUserRouter(router) {
    router.post('/signup', userController.signUp);
    router.post('/signin', userController.signIn);
    router.route('/signout').get(authController.requiresLogin, userController.signOut);
}
module.exports = configureUserRouter;
//# sourceMappingURL=user.router.js.map