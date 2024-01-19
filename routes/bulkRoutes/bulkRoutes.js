// routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const dataController = require('@/controllers/bulkdata/bulkController');
const validateCourseSpecializationMiddleware = require('@/middlewares/coursePermission');
const validateSessionMiddleware = require('@/middlewares/sessionMiddleware');
// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define routes
router.post(
  '/upload',
  upload.single('file'),
  validateCourseSpecializationMiddleware,
  validateSessionMiddleware,
  dataController.uploadData
);

module.exports = router;
