const mongoose = require('mongoose');
const Store = mongoose.model('store');

exports.homepage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();

  req.flash('success', `successfully create ${store.name}. care to leave a review`);
  res.redirect(`/store/${store.slug}`);
};
