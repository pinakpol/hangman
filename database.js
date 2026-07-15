const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./halloffame.db");

db.serialize(() =>
{
    db.run(`
        CREATE TABLE IF NOT EXISTS halloffame
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            player TEXT,
            difficulty TEXT,

            category TEXT,
            word TEXT,

            result TEXT,

            wrong INTEGER,

            played DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db;