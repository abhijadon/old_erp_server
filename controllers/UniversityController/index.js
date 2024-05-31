const list = require('./list');
const create = require('./create');
const update = require('./update');
const remove = require('./remove');


const instituteController = {
  list,
  create,
  update,
  remove,
};

module.exports = instituteController;
