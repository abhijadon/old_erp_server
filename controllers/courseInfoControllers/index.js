const create = require('./create');
const update = require('./update');
const remove = require('./remove');
const list = require('./list');
const {fetchBrochures, uploadBrochure, deleteBrochureFromDatabase} = require('./brochureCreate');

const courseInfoController = {
  create,
  update,
  delete: remove,
  list,
  fetchBrochures,
  uploadBrochure,
  deleteBrochureFromDatabase
};

module.exports = courseInfoController;
