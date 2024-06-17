const express = require('express');
const router = express.Router();
const lmsControllers = require('@/controllers/lmsControllers');
const { hasPermission } = require('@/middlewares/permission');
const { catchErrors } = require('@/handlers/errorHandlers');

router.post('/lms/create/:applicationId',hasPermission('read'), catchErrors(lmsControllers.create));
router.get('/lms/read/:applicationId', catchErrors(lmsControllers.read));

module.exports = router;