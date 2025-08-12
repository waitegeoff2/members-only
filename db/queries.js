const pool = require("./pool")

async function addUser(fullname, username, password, admin) {
    await pool.query("INSERT INTO users (fullname, username, password, is_admin) VALUES ($1, $2, $3, $4)", [
      fullname,
      username,
      password,
      admin
    ])
}

async function addMember(username) {
    await pool.query("UPDATE users SET membership='y' WHERE username=$1", [username])
}

async function getMessages() {
    const { rows } = await pool.query(`
        SELECT users.username, messages.title, messages.text, messages.time_stamp, messages.id
        FROM messages
        INNER JOIN users
        ON messages.user_id = users.id
        `);
    return rows;
}

async function getUser(messageId) {
    //take user id and return the username using inner join with users table
}

async function postMessage(id, title, message) {
    await pool.query("INSERT INTO messages (user_id, title, text) VALUES ($1, $2, $3)", [id, title, message])
}

async function removeMessage(messageId) {
    await pool.query("DELETE FROM messages WHERE id=$1", [messageId])
}

module.exports = {
    addUser,
    addMember,
    getMessages,
    postMessage,
    removeMessage
}