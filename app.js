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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});