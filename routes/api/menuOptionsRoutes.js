const express = require('express');
const router = express.Router();
const menuOptionsController = require('@/controllers/menuOptionsController');

router.get('/menu/list', menuOptionsController.getAllMenuOptions);
router.get('/menu/listAll', menuOptionsController.getAllMenu);
router.post('/menu/create', menuOptionsController.saveMenuOptions);
router.put('/menu/update/:id', menuOptionsController.updateMenuOptions);
router.get('/menu/read/:id', menuOptionsController.getRead);

module.exports = router;