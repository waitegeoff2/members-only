const db = require("../db/queries")
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const alphaErr = "must only contain letters.";
const emptyErr = "is required"
const lengthErr = "must be between 1 and 50 characters.";
const emailErr = "must be formatted like an email.";
const pwMatchErr = "Passwords do not match"

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
        .notEmpty().withMessage(`Confirm Password ${lengthErr}`)
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(`${pwMatchErr}`);
            }
            return true;
        }),
]

const addUser = [
validateUser,
async(req, res, next) => {
//display errors if any
const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        errors: errors.array(),
      });
    }

//if valid, put values into db
try {
    console.log(req.body)
    const user = req.body;
    const fullName = req.body.fullname;
    const userName = req.body.username;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.addUser(fullName, userName, hashedPassword);
    res.render('join', { userName: userName })
} catch(error){
    console.error(error);
    next(error);
}
}
]

async function generateIndex(req, res) {
    //generates the index page but also grabs the messages from the db
    const messages = await db.getMessages();

    //get message user
    //await db.getuser (select on inner join messages users)

    //await db.getmessages
    res.render('index', { user: req.user, messages: messages })
}

async function updateMember(req, res) {
    // if req.body is the right password:
    const username = req.body.hiddenUser
    console.log(req.body.hiddenUser)
    const secret = req.body.secret;
    if(secret.toLowerCase() == 'password') {
        await db.addMember(username);
        res.redirect('/')
    } else {
        res.render('join', {userName: username});
    }
    //update membership status in db
}

async function postMessage(req, res) {
    console.log(req.body)
    const username = req.body.username;
    const id = req.body.userInfo;
    const title = req.body.title;
    const message = req.body.message;
    //passed in message and user id
    await db.postMessage(id, title, message)

    res.redirect('/')
    //update message in db
    //redirect to home page (where it will show messages)
}

module.exports = {
    addUser,
    updateMember,
    postMessage,
    generateIndex
}