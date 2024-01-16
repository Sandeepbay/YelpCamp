const express = require('express')
const router = express.Router()
const catchAsync = require('../utility/catchAsync')
const passport = require('passport')
const { storeReturnTo } = require('../middleware')
const users = require('../controllers/user')

router.get('/register' , users.renderRegister)

router.post('/register', catchAsync(users.register));

router.get('/login' , users.renderlogin)

router.post('/login' , storeReturnTo,   
    passport.authenticate('local' , {failureFlash: true , failureRedirect : '/login'}) , 
    users.login
)

router.get('/logout', users.logout); 

module.exports = router