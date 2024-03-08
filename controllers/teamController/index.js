// teamRoutes.js

const teamController = require('@/controllers/teamController');
const methods = teamController;

; // Correct the import
const update = require('./updateTeam');
const list = require('@/controllers/teamController/getTeam');
const searchTeams = require('@/controllers/teamController/searchTeams');
const deleteTeams = require('@/controllers/teamController/deleteTeam');
const create = require('./createTeam')

methods.create = create;
methods.update = update;
methods.read = list;
methods.search = searchTeams;
methods.delete = deleteTeams;

module.exports = methods;
