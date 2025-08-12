const { Client } = require("pg");
require('dotenv').config();

const SQL = `
CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   fullname VARCHAR ( 255 ),
   username VARCHAR ( 255 ),
   password VARCHAR ( 255 ),
   membership VARCHAR ( 255 ),
   is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR ( 255 ),
    text VARCHAR ( 2000 ),
    time_stamp TIMESTAMP DEFAULT NOW()
);

`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    // connectionString: process.env.DATABASE_URL,
    host: process.env.DB_HOST, // or wherever the db is hosted
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();