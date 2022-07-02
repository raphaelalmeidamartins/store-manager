const { Router } = require('express');
const rescue = require('express-rescue');
const productsController = require('../controllers/productsController');

const productsRoutes = Router();

productsRoutes.get('/search', rescue(productsController.search));
productsRoutes.get('/', rescue(productsController.list));
productsRoutes.get('/:id', rescue(productsController.get));
productsRoutes.post('/', rescue(productsController.add));
productsRoutes.put('/:id', rescue(productsController.edit));
productsRoutes.delete('/:id', rescue(productsController.remove));

module.exports = productsRoutes;
