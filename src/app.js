'use strict';
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var favicon = require('serve-favicon');
var custom_error_1 = require("./model/custom-error");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var app = express();
var db = require('./database/database').connection;
var cors = require('cors');
// PASSPORT CONFIGURATION
// http://stackoverflow.com/questions/23481817/node-js-passport-autentification-with-sqlite
function hashPassword(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}
passport.use(new LocalStrategy(function (username, password, done) {
    db.get('SELECT salt FROM users WHERE username = ?', username, function (err, row) {
        if (!row)
            return done(null, false);
        var hash = hashPassword(password, row.salt);
        db.get('SELECT username, id FROM Users WHERE username = ? AND password = ?', username, hash, function (err, row) {
            if (!row)
                return done(null, false);
            return done(null, row);
        });
    });
}));
passport.serializeUser(function (user, done) {
    return done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    db.get('SELECT id, username FROM users WHERE id = ?', id, function (err, row) {
        if (!row)
            return done(null, false);
        return done(null, row);
    });
});
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'somesecret',
    cookie: { maxAge: 600000 },
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session({
    secret: 'somesecret',
    cookie: { maxAge: 600000 },
    resave: true,
    saveUninitialized: true
}));
app.use(cors({ credentials: true, origin: true }));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/lib', express.static(path.join(__dirname, '../node_modules')));
app.use('/app', express.static(path.join(__dirname, '../app')));
app.use('/css', express.static(path.join(__dirname, '../public/assets/css')));
app.use('/js', express.static(path.join(__dirname, '../public/assets/js')));
app.use('/config', express.static(path.join(__dirname, '../config')));
// Routing
var router = express.Router();
require('./routes/index')(router);
app.use('/', router);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err;
    err = new custom_error_1.CustomError(404, 'Risorsa non trovata');
    next(err);
});
// error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(err);
});
module.exports = app;
//# sourceMappingURL=app.js.map