let sqlite3 = require('sqlite3');


let databasePath = './aliments.dev.db';

if (process.env.NODE_ENV === 'production') {
    databasePath = './aliments.prod.db';
}

console.log(databasePath);

class Database {
    static connection = new sqlite3.Database(databasePath);

    static logQuery(query : string) {
        let parts = query.split("\n");
        parts = parts.map((x) => x.trim());
        console.log(parts.join(" ").trim());
    }

    static initialize() {
        Database.connection.run('PRAGMA foreign_keys = ON'); // Abilita le chiavi esterne
    }
}

Database.initialize();

export = Database;