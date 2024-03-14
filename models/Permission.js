const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  permissions: {
    type: [{
      type: String,
      unique: true, // Ensures that each value in the array is unique
      required: true,
    }],
  },
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
