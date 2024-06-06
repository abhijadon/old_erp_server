const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone: {
    type: Number,
    trim: true,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'subadmin', 'manager', 'supportiveassociate', 'teamleader', 'user'],
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  sessionId: {
    type: String,
    default: null,
  },

});

adminSchema.plugin(require('mongoose-autopopulate'));

adminSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
};

adminSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

adminSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', adminSchema);

module.exports = User;
