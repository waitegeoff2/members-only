const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController")

//home page
indexRouter.get('/', (req, res) => res.render('index'))
// indexRouter.post('/log-in', res.end()) //log user in here

//sign up form
indexRouter.get('/sign-up', (req, res) => res.render('sign-up-form'))
indexRouter.post('/sign-up', indexController.addUser)

//join club
indexRouter.get('/join', (req, res) => res.render('join'))
indexRouter.post('/join', indexController.updateMember) //indexcontroller update membership

module.exports = indexRouter;