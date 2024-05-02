const listAll = require('./list')
const remove = require('./delete')
const create = require('./create')
const menuController = {
  listAll,
  remove,
  create
};

module.exports = menuController;