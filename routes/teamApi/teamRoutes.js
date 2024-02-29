const express = require('express');
const router = express.Router();
const teamController = require('@/controllers/teamController'); // Adjust the path accordingly
const { catchErrors } = require('@/handlers/errorHandlers');
const { getHistoryEntries } = require('@/controllers/middlewaresControllers/createCRUDController/history');


// Example routes with middleware protection
// Teams routes rest API
router.route('/teams/create').post(catchErrors(teamController.create));
router.route('/teams/list').get(catchErrors(teamController.read));
router.route('/teams/update/:id').patch(catchErrors(teamController.update));
router.route('/teams/search').get(catchErrors(teamController.search));
router.route('/teams/delete/:teamId').delete(catchErrors(teamController.delete)); // Include :teamId as a parameter
router.get('/history/list', getHistoryEntries);
// Teams routes rest API

module.exports = router;
