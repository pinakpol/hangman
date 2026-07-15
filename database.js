const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initialize()
{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS halloffame
        (
            id SERIAL PRIMARY KEY,
            player TEXT,
            difficulty TEXT,
            category TEXT,
            word TEXT,
            result TEXT,
            wrong INTEGER,
            played TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Database Ready");
}

initialize();

module.exports = pool;