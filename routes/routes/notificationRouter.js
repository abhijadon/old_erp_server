const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  deleteNotificationById,
} = require('@/controllers/middlewaresControllers/createCRUDController/getNotification');

router.get('/notifications', getAllNotifications);
router.delete('/notifications/:id', deleteNotificationById);

module.exports = router;
