const express = require('express');
const router = express.Router();
const courseInfoControllers = require('@/controllers/courseInfoControllers');
const { catchErrors } = require('@/handlers/errorHandlers');


router.route('/info/create').post(catchErrors(courseInfoControllers.create));
router.route('/info/update/:id').patch(catchErrors(courseInfoControllers.update));
router.route('/info/delete/:id').delete(catchErrors(courseInfoControllers.delete));
router.route('/info/list').get(catchErrors(courseInfoControllers.list));


module.exports = router;