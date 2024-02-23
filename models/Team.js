// teamModel.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  institute: [{
    type: String,
    trim: true
  }],
  university: [{
    type: String,
    trim: true
  }],
  teamName: {
    type: String,
    trim: true,
  },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
