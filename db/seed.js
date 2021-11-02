require('dotenv').config();
const pg = require('pg');

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runCommands() {
  await pool.query(`INSERT INTO "car" ("licensePlate", "color") VALUES
    ('A000AA', 'White'),
    ('A001AA', 'Blue'),
    ('A002AA', 'Red'),
    ('A003AA', 'Green'),
    ('A004AA', 'Orange')
  `);
}

runCommands();
