// teamRoutes.js
const permission = require('@/controllers/permissions');
const methods = permission;


const create = require('@/controllers/permissions/create');
const list = require('@/controllers/permissions/list');
const update = require('@/controllers/permissions/update');



methods.create = create;
methods.list = list;
methods.update = update;



module.exports = methods;
