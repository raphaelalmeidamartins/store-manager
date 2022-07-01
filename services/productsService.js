const Joi = require('joi');
const productsModel = require('../models/productsModels');
const validateData = require('./validators');

const productsService = {
  validate: {
    paramsId: validateData(
      Joi.object({
        id: Joi.number().required().positive().integer(),
      }),
    ),
  },
  async exists(id) {
    const exists = await productsModel.exists(id);
    return exists;
  },
  async get(id) {
    const product = await productsModel.get(id);
    return product;
  },
  async list() {
    const products = await productsModel.list();
    return products;
  },
};

module.exports = productsService;
