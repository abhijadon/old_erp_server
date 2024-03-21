const express = require('express');
const router = express.Router();
const applicationHistoryController = require('@/controllers/historyControllers/applicationHistory');
const paymentHistoryController = require('@/controllers/historyControllers/paymentHistory'); 
const userHistoryController = require('@/controllers/historyControllers/userHistory'); 
const { hasPermission } = require('@/middlewares/permission');

// Define a reusable error handler function
const errorHandler = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
};

// Define a reusable route handler function
const getHistoryHandler = async (req, res, historyController) => {
  const { id } = req.params;
  try {
    const history = await historyController.getStudentHistory(id);
    res.json(history);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Routes
router.get('/lead/history/:id', hasPermission('read'), async (req, res) => {
  await getHistoryHandler(req, res, applicationHistoryController);
});

router.get('/payment/history/:id', hasPermission('read'), async (req, res) => {
  await getHistoryHandler(req, res, paymentHistoryController);
});

router.get('/admin/history/:id', hasPermission('read'), async (req, res) => {
  await getHistoryHandler(req, res, userHistoryController);
});

module.exports = router;
