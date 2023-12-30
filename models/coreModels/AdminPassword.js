const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const AdminPasswordSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  emailToken: String,
  resetToken: String,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  authType: {
    type: String,
    default: 'email',
  },
  loggedSessions: {
    type: [String],
    default: [],
  },
});

// AdminPasswordSchema.index({ user: 1 });

// Generating a hash
AdminPasswordSchema.methods.generateHash = function (userpassword) {
  // Use the user's salt and password to generate a hash
  return bcrypt.hashSync(this.salt + userpassword, bcrypt.genSaltSync(8));
};

// Checking if the password is valid
AdminPasswordSchema.methods.validPassword = function (userpassword) {
  // Compare the entered password with the stored hash
  return bcrypt.compareSync(this.salt + userpassword, this.password);
};

module.exports = mongoose.model('AdminPassword', AdminPasswordSchema);
