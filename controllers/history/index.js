// teamRoutes.js
const history = require('@/controllers/history');
const methods = history;

const list = require('@/controllers/history/list');

methods.list = list;


module.exports = methods;
