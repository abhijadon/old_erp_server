const express = require('express');
const router = express.Router();
const teamController = require('@/controllers/teamController'); // Adjust the path accordingly
const { catchErrors } = require('@/handlers/errorHandlers');
const { hasPermission } = require('@/middlewares/permission');

// Teams routes rest API
router.route('/teams/create').post(catchErrors(teamController.create));
router.route('/teams/list').get(catchErrors(teamController.read));
router.route('/teams/update/:id').patch(catchErrors(teamController.update));
router.route('/teams/search').get(catchErrors(teamController.search));
router.route('/teams/delete/:teamId').delete(hasPermission('delete'),catchErrors(teamController.delete)); // Include 
// Teams routes rest API

module.exports = router;
