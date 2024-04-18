// teamRoutes.js
const permission = require('@/controllers/permissions');
const methods = permission;


const create = require('@/controllers/permissions/create');
const list = require('@/controllers/permissions/list');
const update = require('@/controllers/permissions/update');
const remove = require('@/controllers/permissions/delete');



methods.create = create;
methods.list = list;
methods.update = update;
methods.remove = remove;



module.exports = methods;
