const db = require("../db/queries")
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const alphaErr = "must only contain letters.";
const emptyErr = "is required"
const lengthErr = "must be between 1 and 50 characters.";
const emailErr = "must be formatted like an email.";
const pwMatchErr = "Passwords entered must match"

const validateUser = [
    body("fullname").trim()
    .notEmpty().withMessage(`Full name ${emptyErr}`)
    .isLength({ min: 1, max: 50 }).withMessage(`Full name ${lengthErr}`),
    body("username").trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Full name ${lengthErr}`)
    .isEmail().withMessage(`Email ${emailErr}`), 
    body('password')
    .notEmpty().withMessage(`Password ${emptyErr}`)
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('confirmpassword')
        .notEmpty().withMessage('Confirm Password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
]

const addUser = [
validateUser,
async(req, res, next) => {
const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        errors: errors.array(),
      });
    }

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
]

module.exports = {
    addUser,
}