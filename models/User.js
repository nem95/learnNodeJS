const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Inalid email address'],
    required: 'Please supply an email address',
  },
  name: {
    type: String,
    trim: true,
    required: 'Please supply aname',
  },
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrHandler);

module.exports = mongoose.model('User', userSchema)
