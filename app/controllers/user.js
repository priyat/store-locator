'use strict';

var express = require('express');
var router = express.Router();

var passport = require('../../config/passport');
var User = require('../models/user');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/users/register', function (req, res, next) {
  res.render('register');
});

router.post('/users/register', function (req, res, next) {
  console.log(req.body);
  User.register(req.body.email, req.body.password, function (err, user) {
    if (err) {
      return next(err);
    }

    console.log(req.body);
    req.login(user, function (err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });
});

router.get('/users/login', function (req, res, next) {
  res.render('login');
});

router.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
}));

