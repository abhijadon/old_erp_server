require('dotenv').config({ path: __dirname + '/../.env' });
require('dotenv').config({ path: __dirname + '/../.env.local' });

const mongoose = require('mongoose');
await mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

async function deleteData() {
  const Admin = require('../models/User');
  const Setting = require('../models/appModels/coreModels/Setting');
  const Email = require('../models/appModels/coreModels/Email');
  await Admin.deleteMany();
  console.log('👍 admin Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  await Setting.deleteMany();
  console.log('👍 Setting Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  await Email.deleteMany();
  console.log('👍 Email Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  process.exit();
}

deleteData();
