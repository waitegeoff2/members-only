// npm install express express-session pg passport passport-local ejs dotenv express-validator
const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
const indexRouter = require("./routes/indexRouter")
require('dotenv').config();


//view library
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//this allows the app to parse form data into req.
app.use(express.urlencoded({ extended: true }));

//static assets path (CSS, etc.)
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(session({ secret: "dog", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//router
app.use("/", indexRouter);

//PASSPORT PASSWORD/COOKIE FUNCTIONS (UPDATE)
//match un and pw
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);

    if (!user) {
        return done(null, false, { message: "Incorrect username" });
    }
    if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
    }
    //if successful, return the user
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);
//function TWO and THREE:
//allowing users to log in and stay logged in as they move around
//creates a cookie called connect.sid that is stored in the user's browser 
//HOW THEY WORK (basically just BACKGROUND FUNCTIONS):
// When a session is created, passport.serializeUser will receive the user object found from a 
// successful login and store its id property in the session data. 
// Upon some other request, if it finds a matching session for that request, 
// passport.deserializeUser will retrieve the id we stored in the session data.
//We then use that id to query our database for the specified user, then done(null, user) attaches that user 
// object to req.user. Now in the rest of the request, we have access to that user object via req.user.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});