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

async function getMessages() {
    const { rows } = await pool.query("SELECT * FROM messages");
    return rows;
}

async function postMessage(id, title, message) {
    await pool.query("INSERT INTO messages (user_id, title, text) VALUES ($1, $2, $3)", [id, title, message])
}

module.exports = {
    addUser,
    addMember,
    getMessages,
    postMessage
}