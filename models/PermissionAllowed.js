const mongoose = require('mongoose');

const permissionallowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    trim: true,
  },
  allowedInstitutes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    trim: true,
  }],
  allowedUniversities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const PermissionAllowed = mongoose.model('PermissionAllowed', permissionallowSchema);

module.exports =  {PermissionAllowed};
