const express = require('express');

const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const {
  isValidAdminToken,
  login,
  logout,
} = require('@/controllers/coreControllers/authJwtController');
const userlog = require('@/controllers/historyControllers/userLogs');

router.route('/login').post(catchErrors(login));
router.route('/logout').post(isValidAdminToken, catchErrors(logout));
router.route('/user/logs').get(catchErrors(userlog));

module.exports = router;
