// teamRoutes.js

const teamController = require('@/controllers/teamController');
const methods = teamController;

; // Correct the import
const updateTeam = require('@/controllers/teamController/updateTeam');
const getTeams = require('@/controllers/teamController/getTeam');
const searchTeams = require('@/controllers/teamController/searchTeams');
const deleteTeams = require('@/controllers/teamController/deleteTeam');
const create = require('./createTeam')

methods.create = create;
methods.update = updateTeam;
methods.read = getTeams;
methods.search = searchTeams;
methods.delete = deleteTeams;

module.exports = methods;
