const express = require('express');
const router = express.Router();
const applicationHistoryController = require('@/controllers/historyControllers/applicationHistory');
const paymentHistoryController = require('@/controllers/historyControllers/paymentHistory'); 
const userHistoryController = require('@/controllers/historyControllers/userHistory'); 

router.get('/lead/history/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const history = await applicationHistoryController.getStudentHistory(id);
    res.json(history);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/payment/history/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const history = await paymentHistoryController.getStudentHistory(id);
    res.json(history);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/admin/history/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const history = await userHistoryController.getStudentHistory(id);
    res.json(history);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
