'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, done);
});

function authFail(done) {
  done(null, false, {
    message: 'Incorrent email/password combination',
  });
}

passport.use(new LocalStrategy({
  usernameField: 'email',
}, function (email, password, done) {
  User.findOne({
    email: email,
  }, function (err, user) {
    if (err) return done(err);
    if (!user) {
      return authFail(done);
    }

    if (!user.validPassword(password)) {
      return authFail(done);
    }

    return done(null, user);
  });
}));

module.exports = passport;
