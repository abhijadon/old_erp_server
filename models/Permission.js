const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  permissions: [{
    type: String,
    required: true,
  }],
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
