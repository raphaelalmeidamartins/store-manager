const { Router } = require('express');
const rescue = require('express-rescue');
const productsController = require('../controllers/productsController');

const productsRoutes = Router();

productsRoutes.get('/', rescue(productsController.list));
productsRoutes.get('/:id', rescue(productsController.get));

module.exports = productsRoutes;
