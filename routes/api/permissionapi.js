const express = require('express');
const router = express.Router();
const permissions = require('@/controllers/permissions'); // Adjust the path accordingly
const { catchErrors } = require('@/handlers/errorHandlers');
const { hasPermission } = require('@/middlewares/permission');

router.route('/permission/create').post(catchErrors(permissions.create));
router.route('/permission/list').get(catchErrors(permissions.list));
router.route('/permission/update/:id').patch(hasPermission('update'),catchErrors(permissions.update));
router.route('/permission/delete/:userId').delete(hasPermission('delete'),catchErrors(permissions.remove));
// Teams routes rest API

module.exports = router;
