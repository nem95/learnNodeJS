const passport = require('passport');

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
