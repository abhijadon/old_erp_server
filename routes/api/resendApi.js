const express = require('express');
const router = express.Router();

// Middleware to check user roles
const { checkRole } = require('@/middlewares/checkRole'); // Check user roles

const { resendPaymentEmail } = require('@/controllers/middlewaresControllers/createCRUDController/resendMail'); // Import resendPaymentEmail function

// Route for resending emails, with role check
router.post('/applications/:id/resend-email', checkRole('admin', 'subadmin', 'manager'), resendPaymentEmail);

module.exports = router;
