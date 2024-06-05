const express = require('express');
const router = express.Router();
const lmsControllers = require('@/controllers/lmsControllers');

const { catchErrors } = require('@/handlers/errorHandlers');

router.post('/lms/create/:applicationId', catchErrors(lmsControllers.create));
router.get('/lms/read/:applicationId', catchErrors(lmsControllers.read));

module.exports = router;