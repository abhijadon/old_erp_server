const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  institute: [{
    type: String,
    trim: true,
  }],
  university: [{
    type: String,
    trim: true,
  }],
  teamName: {
    type: String,
    trim: true,
  },
  divided: {
    type: Number,
    default: 0,
  },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
