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
  await pool.query(`CREATE TABLE booking (
    "uuid" uuid DEFAULT uuid_generate_v4 (),
    "from" timestamp with time zone NOT NULL,
    "to" timestamp with time zone NOT NULL,
    "carId" smallint NOT NULL,
    "cost" real NOT NULL,
    PRIMARY KEY ("uuid")
  )`);

  await pool.query(`CREATE TABLE car (
    "id" smallint generated always as identity,
    "licensePlate" varchar(10) NOT NULL UNIQUE,
    "color" varchar(20) NOT NULL,
    PRIMARY KEY ("id")
  )`);

  await pool.query(
    'ALTER TABLE booking ADD CONSTRAINT fkBookingCars FOREIGN KEY ("carId") REFERENCES car (id) ON DELETE CASCADE',
  );
}

runCommands();
