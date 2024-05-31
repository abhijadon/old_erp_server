const list = require('./list');
const create = require('./create');
const update = require('./update');
const remove = require('./remove');

const courseController = {
  list,
  create,
  update,
  remove,
};

module.exports = courseController;
