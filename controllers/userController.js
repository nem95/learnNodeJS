const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const User = mongoose.model('User');
const { promisify } = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
}

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
}

exports.preValidateRegister = [
  check('name').notEmpty().withMessage('You must supply a name'),
  check('email').notEmpty().isEmail().withMessage('That email is not valid').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  }),
  check('password').notEmpty().withMessage('Password cannot be blank'),
  check('password-confirm')
    .notEmpty()
    .custom((value, { req }) => value === req.body.password).withMessage('Ooops!! your Passwords do not match'),
];

exports.validateRegister = (req, res, next) => {
  const result = validationResult(req);

  if (result.errors.length > 0) {
    req.flash('error', result.errors.map(err => err.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash()
    });
    return;
  }

  next();
};

exports.register = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    name: req.body.name,
  });
  const register = promisify(User.register.bind(User));
  await register(user, req.body.password);

  next();
};

exports.account = (req, res) => {
  res.render('account', { title: 'Edit your account' });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
  };

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' },
  );

  req.flash('success', 'Profile updated successfully!!');
  res.redirect('back');
};
