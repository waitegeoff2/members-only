const pool = require("./pool")

async function addUser(fullname, username, password) {
    await pool.query("INSERT INTO users (fullname, username, password) VALUES ($1, $2, $3)", [
      fullname,
      username,
      password
    ])
}

async function addMember(username) {
    await pool.query("UPDATE users SET membership='y' WHERE username=$1", [username])
}

module.exports = {
    addUser,
    addMember
}