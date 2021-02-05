const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const tokenString = 'amuguna';
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    employeeNo: {
      type: Number,
      unique: 1
    },
    name: {
      type: String,
      maxlength: 50
    },
    hurigana: {
      type: String
    },
    email: {
      type: String,
      trim: true,
      unique: 1
    },
    password: {
      type: String,
      minlength: 1
    },
    role: {
      type: Number,
      default: 0
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    token: {
      type: String
    },
    tokenExp: {
      type: Number
    }
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    // encrypt password
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  const user = this;
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb('unvalid password');
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  const user = this;
  var token = jwt.sign(user._id.toHexString(), tokenString);
  // user._id + 'amuguna' = token
  // ->
  // 'amuguna' -> user._id

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  const user = this;
  // decode token
  jwt.verify(token, tokenString, function (err, decoded) {
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

userSchema.statics.getMailCheckKey = function (email) {
  return jwt.sign(email, tokenString);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
