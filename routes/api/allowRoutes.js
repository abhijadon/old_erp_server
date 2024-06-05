const express = require('express');
const router = express.Router();
const PermissionAllowedController = require('@/controllers/permissionsAllowed'); 
const { catchErrors } = require('@/handlers/errorHandlers');
const universityController = require('@/controllers/UniversityController');
const instituteController = require('@/controllers/InstituteCtr');
const courseController = require('@/controllers/courseController');
const subcourseController = require('@/controllers/subcourse');

// create new allow api controller
router.route('/allow/list').get(catchErrors(PermissionAllowedController.list));
router.route('/allow/create').post(catchErrors(PermissionAllowedController.create));
router.route('/allow/update/:id').patch(catchErrors(PermissionAllowedController.update));
router.route('/allow/delete/:id').delete(catchErrors(PermissionAllowedController.remove));
// Teams routes rest API
// Create a new University
router.route('/university/list').get(catchErrors(universityController.list));
router.route('/university/create').post(catchErrors(universityController.create));
router.route('/university/update/:id').patch(catchErrors(universityController.update));
router.route('/university/delete/:id').delete(catchErrors(universityController.remove));

// Create a new IsntituteCont
router.route('/institute/list').get(catchErrors(instituteController.list));
router.route('/institute/create').post(catchErrors(instituteController.create));
router.route('/institute/update/:id').patch(catchErrors(instituteController.update));
router.route('/institute/delete/:id').delete(catchErrors(instituteController.remove));


// Create a new course ApiController
router.route('/course/create').post(catchErrors(courseController.create));
router.route('/course/list').get(catchErrors(courseController.list));
router.route('/course/update/:id').patch(catchErrors(courseController.update));
router.route('/course/delete/:id').delete(catchErrors(courseController.remove));

// Create a new subcourse ApiController
router.route('/subcourse/create').post(catchErrors(subcourseController.create));
router.route('/subcourse/list').get(catchErrors(subcourseController.list));
router.route('/subcourse/update/:id').patch(catchErrors(subcourseController.update));
router.route('/subcourse/delete/:id').delete(catchErrors(subcourseController.remove));


module.exports = router;

