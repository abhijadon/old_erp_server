
const express = require('express');
const { createInstitute, getAllInstitutes, getInstituteById } = require('@/controllers/instituteController');
const router = express.Router();

router.post('/institutes', createInstitute);
router.get('/institutes', getAllInstitutes);
router.get('/institutes/:id', getInstituteById);

module.exports = router;





