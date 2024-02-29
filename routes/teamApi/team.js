// Import necessary modules and models
const express = require('express');
const router = express.Router();
const checkUserRoleMiddleware = require('@/middlewares/checkUserRole');
const paginatedList = require('@/controllers/middlewaresControllers/createCRUDController/paginatedList');
const YourModel = require('@/models/Application'); // Replace with your actual Mongoose model

// Define a route to get data for a specific user
router.get('/data/:userId', async (req, res) => {
  try {
    // Assuming req.params.userId contains the user ID you want to filter by
    req.queryConditions.userId = req.params.userId;

    // Now req.queryConditions will include both the role-based conditions and the user-specific condition
    await paginatedList(YourModel, req, res);
  } catch (error) {
    console.error('Error in user data route:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Define other routes as needed

// Export the router to be used in your main application file
module.exports = router;
