const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { promisify } = require('es6-promisify');

const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login',
  successRedirect: '/',
  successFlash: 'You are now logged In!',
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'you are now logged out!!!');
  res.redirect('/')
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash('error', 'You must be logged in!!');
  res.redirect('/login');
};

exports.forgot = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    req.flash('error', 'No account with that email');
    return res.redirect('/login');
  }

  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000;

  await user.save();

  const resetUrl = `http:/${req.headers.host}/account/reset/${user.resetPasswordToken}`;


  req.flash('success', `You have been emailed a password reset link!! ${resetUrl}`);
  res.redirect('/login');
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }

  res.render('reset', { title: 'Reset yourd password' });
};

exports.confirmedPassword = (req, res, next) => {
  if(req.body.password === req.body['password-confirm']) {
    return next();
  }

  req.flash('error', 'Password do not match');
  res.redirect('back');
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword.bind(user));

  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', 'Nice your password has been reset ! you are now logged in!!');
  res.redirect('/');
};
