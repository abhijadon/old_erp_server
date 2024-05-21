const create = require('./create');
const update = require('./update');
const remove = require('./remove');
const list = require('./list');

const courseInfoController = {
  create,
  update,
  delete: remove,
  list,
};

module.exports = courseInfoController;
