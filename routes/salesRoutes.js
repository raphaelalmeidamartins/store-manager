const { Router } = require('express');
const rescue = require('express-rescue');
const salesController = require('../controllers/salesController');

const salesRoutes = Router();

salesRoutes.get('/', rescue(salesController.list));
salesRoutes.get('/:id', rescue(salesController.get));
salesRoutes.post('/', rescue(salesController.add));
salesRoutes.put('/:id', rescue(salesController.edit));
salesRoutes.delete('/:id', rescue(salesController.remove));

module.exports = salesRoutes;
