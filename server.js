require('module-alias/register');
const mongoose = require('mongoose');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const path = require('path');

// Make sure we are running Node.js version 7.6 or higher
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 16 || (major === 16 && minor < 20)) {
  console.log('Please upgrade your Node.js version to at least 16.20.2 or greater. 👌\n');
  process.exit();
}

// Import environmental variables from .env files
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

// Connect to the Database and handle any bad connections
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('====🚀🚀🚀Connected to the database and working fine🚀🚀🚀====');
  } catch (error) {
    console.log(
      '🔥 Common Error caused issue → : Check your .env file first and add your MongoDB URL'
    );
    console.error(`🚫 Error → : ${error.message}`);
    process.exit(1); // Exit with a non-zero code to indicate failure
  }
}

async function importModels() {
  try {
    // Import all model files
    const files = await glob('./models/**/*.js');
    files.forEach((file) => {
      require(path.resolve(file));
    });
  } catch (error) {
    console.error(`Error importing models: ${error.message}`);
    process.exit(1); // Exit with a non-zero code to indicate failure
  }
}

// Start the app
async function startApp() {
  await connectToDatabase();
  await importModels();

  const app = require('./app');
  app.set('port', process.env.PORT || 8888);
  const server = app.listen(app.get('port'), () => {
    console.log(` ==============🎉🎉🚀🚀=============
 Express running → On PORT: ${server.address().port} 
 ==============🚀🚀🚀🚀=============`);
  });
}

startApp();
