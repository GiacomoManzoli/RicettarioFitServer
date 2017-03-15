'use strict';
let crypto = require('crypto');
let db = require('../database/database').connection;
let passport = require('passport');

function hashPassword(password, salt) {
    let hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}

class UserController {
    static signUp(req, res, next) : void {
        console.log("/singup POST");
        console.log(req.body);
        db.get('SELECT username FROM Users WHERE username = ?', req.body.username, function(err, row) {
            if (!row) {
                // Username libero
                let salt = crypto.randomBytes(16).toString('base64');
                let hash = hashPassword(req.body.password, salt);
                let query = 'INSERT INTO "Users" ("username","password","salt") VALUES ( ? , ? , ? )';

                db.run(query, [req.body.username, hash, salt], function() {
                    res.json({status: "ok", username:req.body.username, hash:hash});
                });
            } else {
                // Username occupato
                let err: any;
                err = new Error('Utente già registrato');
                err.status = 500;
                next(err);
            }
        });
    }

    static signIn(req, res, next) : void {
        passport.authenticate('local', function (err, user, info)
        {
            console.log(user);
            if (err || !user)
            {
                if(!err)
                    err= [];
                err.code = 401;
                err.message= "Nome utente o password errata";
                next(err);
            }
            else
            {
                req.login(user, function (err)
                {
                    if (err)
                    {
                        err.code = 401;
                        next(err);
                    }
                    else
                    {
                        res.json({ status : 'ok', userId: user.id});
                    }
                });
            }
        })(req, res, next);


    }

    static signOut(req, res)
    {
        req.logout();
        res.json({ status: 'ok'});
    }

}

export = UserController;