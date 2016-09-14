'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var validator = require('validator');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Rehash the password everytime the user changes it.
  this.password = User.encryptPassword(this.password);
  next();
});

UserSchema.methods = {
  validPassword: function (password) {
    return bcrypt.compareSync(password, this.password);
  },
};

UserSchema.statics = {
  makeSalt: function () {
    return bcrypt.genSaltSync(10);
  },

  encryptPassword: function (password) {
    if (!password) {
      return '';
    }

    return bcrypt.hashSync(password, User.makeSalt());
  },

  register: function (email, password, cb) {
    var user = new User({
      email: email,
      password: password,
    });

    user.save(function (err) {
      cb(err, user);
    });
  },
};

var User = mongoose.model('User', UserSchema);

User.schema.path('email').validate(function (email) {
  return validator.isEmail(email);
});

User.schema.path('password').validate(function (password) {
  return validator.isLength(password, 6);
});

module.exports = User;

