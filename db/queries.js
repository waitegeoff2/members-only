const pool = require("./pool")

async function addUser(fullname, username, password) {
    await pool.query("INSERT INTO users (fullname, username, password) VALUES ($1, $2, $3)", [
      fullname,
      username,
      password
    ]);
}

module.exports = {
    addUser,
}