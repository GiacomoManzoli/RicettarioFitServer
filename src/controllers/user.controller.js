'use strict';
var crypto = require('crypto');
var db = require('../database/database').connection;
var passport = require('passport');
function hashPassword(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}
var UserController = (function () {
    function UserController() {
    }
    UserController.signUp = function (req, res, next) {
        console.log("/singup POST");
        console.log(req.body);
        db.get('SELECT username FROM Users WHERE username = ?', req.body.username, function (err, row) {
            if (!row) {
                // Username libero
                var salt = crypto.randomBytes(16).toString('base64');
                var hash_1 = hashPassword(req.body.password, salt);
                var query = 'INSERT INTO "Users" ("username","password","salt") VALUES ( ? , ? , ? )';
                db.run(query, [req.body.username, hash_1, salt], function () {
                    res.json({ status: "ok", username: req.body.username, hash: hash_1 });
                });
            }
            else {
                // Username occupato
                var err_1;
                err_1 = new Error('Utente già registrato');
                err_1.status = 500;
                next(err_1);
            }
        });
    };
    UserController.signIn = function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            console.log(user);
            if (err || !user) {
                if (!err)
                    err = [];
                err.code = 401;
                err.message = "Nome utente o password errata";
                next(err);
            }
            else {
                req.login(user, function (err) {
                    if (err) {
                        err.code = 401;
                        next(err);
                    }
                    else {
                        res.json({ status: 'ok', userId: user.id });
                    }
                });
            }
        })(req, res, next);
    };
    UserController.signOut = function (req, res) {
        req.logout();
        res.json({ status: 'ok' });
    };
    return UserController;
}());
module.exports = UserController;
//# sourceMappingURL=user.controller.js.map