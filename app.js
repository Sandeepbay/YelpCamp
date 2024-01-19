const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const expressError = require("./utility/expressError")
const path = require("path");
const methodOverride = require("method-override");
const campgroundRoutes = require('./routes/campground.js')
const reviewRoutes = require('./routes/review.js')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require("passport-local")
const User = require('./models/user.js')
const userRoutes = require('./routes/user.js')

mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.once("error", console.error.bind(console, "connection error:"));
db.on("open", () => {
  console.log("Database Connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie : {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/fakeUser' , async (req,res) => {
  const user = new User({ email: 'sandeep@gmail.com', username: 'Sandeepbay'})
  const newUser = await User.register(user , 'anuska') 
  res.send(newUser)
})

app.use((req,res,next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use('/' , campgroundRoutes)
app.use('/' , reviewRoutes)
app.use('/' , userRoutes)

app.use(express.static(path.join(__dirname , 'public')))

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*" , (req,res,next) => {
  next(new expressError("Page not found" , 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log("Server running on Port 3000!");
});

