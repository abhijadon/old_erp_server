const teamController = require('@/controllers/teamController');
const methods = teamController;

const createTeam = require('@/controllers/teamController/createTeam');
const updateTeam = require('@/controllers/teamController/updateTeam');
const getTeams = require('@/controllers/teamController/getTeam');
const searchTeams = require('@/controllers/teamController/searchTeams');
const deleteTeams = require('@/controllers/teamController/deleteTeam');

methods.create = createTeam;
methods.update = updateTeam;
methods.read = getTeams;
methods.search = searchTeams;
methods.delete = deleteTeams;

module.exports = methods;
