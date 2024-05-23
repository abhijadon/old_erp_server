const express = require('express');
const router = express.Router();
const menuOptionsController = require('@/controllers/menuOptionsController');
const menuController = require('@/controllers/menuOptions');
const { catchErrors } = require('@/handlers/errorHandlers');

router.get('/menu/list', menuOptionsController.getAllMenuOptions);
router.get('/menu/listAll', menuController.listAll);
router.route('/menu/delete/:userId').delete(catchErrors(menuController.remove));
router.route('/menu/create').post(catchErrors(menuController.create));
router.patch('/menu/update/:id', menuOptionsController.updateMenuOptions);
router.get('/menu/read/:id', menuOptionsController.getRead);

module.exports = router;