const create = require('./create');
const update = require('./update');
const remove = require('./remove');
const list = require('./list');
const {fetchBrochures, uploadBrochure} = require('./brochureCreate');

const courseInfoController = {
  create,
  update,
  delete: remove,
  list,
  fetchBrochures,
  uploadBrochure,
};

module.exports = courseInfoController;
