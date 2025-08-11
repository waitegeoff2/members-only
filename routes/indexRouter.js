const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController")
const passport = require("passport");

//home page
indexRouter.get('/', (req, res) => res.render('index', { user: req.user }))
indexRouter.post(
      "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

//log out(passport adds a logout function to the req object)
indexRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//sign up form
indexRouter.get('/sign-up', (req, res) => res.render('sign-up-form'))
indexRouter.post('/sign-up', indexController.addUser)

//join club
indexRouter.get('/join', (req, res) => res.render('join'))
indexRouter.post('/join', indexController.updateMember) //indexcontroller update membership

//post message
indexRouter.get('/new-message', (req, res) => res.render ('new-message'))
// indexRouter.get('/new-message/:userId', (req, res) => res.render ('new-message', { user: req.user }))
indexRouter.post('/new-message', indexController.postMessage)

module.exports = indexRouter;