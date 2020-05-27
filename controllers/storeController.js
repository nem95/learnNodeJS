const mongoose = require('mongoose');
const Store = mongoose.model('store');

exports.homepage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  await store.save();
  console.log('It works');
  res.redirect('/');
};
