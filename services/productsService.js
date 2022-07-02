const Joi = require('joi');
const productsModel = require('../models/productsModel');
const validateData = require('./validators');
const NotFoundError = require('../errors/NotFoundError');

const productsService = {
  validate: {
    paramsId: validateData(
      Joi.object({
        id: Joi.number().required().positive().integer(),
      }),
    ),
    body: validateData(
      Joi.object({
        name: Joi.string().required().min(5),
      }),
    ),
  },
  async exists(id) {
    const exists = await productsModel.exists(id);
    if (!exists) {
      throw new NotFoundError('Product not found');
    }
  },
  async get(id) {
    const product = await productsModel.get(id);
    return product;
  },
  async list() {
    const products = await productsModel.list();
    return products;
  },
  async add(data) {
    const id = await productsModel.add(data);
    return id;
  },
  async edit(id, updates) {
    const done = await productsModel.edit(id, updates);
    return done;
  },
  async remove(id) {
    const done = await productsModel.remove(id);
    return done;
  },
  async search(searchTerm) {
    const products = await productsModel.search(searchTerm);
    return products;
  },
};

module.exports = productsService;
