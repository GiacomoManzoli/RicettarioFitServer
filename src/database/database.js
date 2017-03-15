"use strict";
var sqlite3 = require('sqlite3');
var databasePath = './aliments.dev.db';
if (process.env.NODE_ENV === 'production') {
    databasePath = './aliments.prod.db';
}
console.log(databasePath);
var Database = (function () {
    function Database() {
    }
    Database.logQuery = function (query) {
        var parts = query.split("\n");
        parts = parts.map(function (x) { return x.trim(); });
        console.log(parts.join(" ").trim());
    };
    Database.initialize = function () {
        Database.connection.run('PRAGMA foreign_keys = ON'); // Abilita le chiavi esterne
    };
    Database.connection = new sqlite3.Database(databasePath);
    return Database;
}());
Database.initialize();
module.exports = Database;
//# sourceMappingURL=database.js.map