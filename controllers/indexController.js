const db = require("../db/queries")
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

async function addUser(req, res, next) {
try {
    console.log(req.body)
    const fullName = req.body.fullname;
    const userName = req.body.username;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.addUser(fullName, userName, hashedPassword);
    res.redirect('/')
} catch(error){
    console.error(error);
    next(error);
}
}

module.exports = {
    addUser,
}