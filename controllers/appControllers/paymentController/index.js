const create = require('./create');
const read = require('./read');
const update = require('./update');
const remove = require('./remove');
const paginatedList = require('./list');
const summary = require('./summary');
const sendMail = require('./sendMail')
const filter = require('./filter');
const search = require('./search');
const paymentController = {
  create,
  read,
  filter,
  search,
  update,
  paginatedList,
  summary,
  sendMail,
  delete: remove,
};

module.exports = paymentController;
