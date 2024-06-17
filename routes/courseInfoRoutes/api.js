const express = require('express');
const router = express.Router();
const courseInfoControllers = require('@/controllers/courseInfoControllers');
const { catchErrors } = require('@/handlers/errorHandlers');
const { firebaseStorageUpload, saveImageUrls } = require('@/firebase/brochureFirebase');
const { checkRole } = require('@/middlewares/checkRole');

router.route('/info/create').post(catchErrors(courseInfoControllers.create));
router.route('/info/update/:id').patch(catchErrors(courseInfoControllers.update));
router.route('/info/delete/:id').delete(catchErrors(courseInfoControllers.delete));
router.route('/info/list').get(catchErrors(courseInfoControllers.list));
router.route('/brochures/list').get(catchErrors(courseInfoControllers.fetchBrochures));
router.post('/brochures/upload', checkRole('admin', 'subadmin', 'manager'), firebaseStorageUpload, saveImageUrls, catchErrors(courseInfoControllers.uploadBrochure));

module.exports = router;
