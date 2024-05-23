const {create} = require('./create');
const {read} = require('./get')

const lmsController = {
  create,
  read,
};

module.exports = lmsController;
