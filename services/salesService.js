const Joi = require('joi');
const salesModel = require('../models/salesModel');
const salesProductsModel = require('../models/salesProductsModel');
const validateData = require('./validators');
const NotFoundError = require('../errors/NotFoundError');

const salesService = {
  validate: {
    paramsId: validateData(
      Joi.object({
        id: Joi.number().required().positive().integer(),
      }),
    ),
    bodyAdd: validateData(
      Joi.array().items(
        Joi.object({
          productId: Joi.number().required().positive().integer(),
          quantity: Joi.number().required().min(1).integer(),
        }),
      ),
    ),
  },
  async exists(id) {
    const exists = await salesModel.exists(id);
    if (!exists) {
      throw new NotFoundError('Sale not found');
    }
  },
  async get(id) {
    const { date } = await salesModel.get(id);
    let salesProducts = await salesProductsModel.list();
    salesProducts = salesProducts.filter(
      (currProduct) => currProduct.sale_id === id,
    );
    return salesProducts.map(({ product_id: productId, quantity }) => ({
      date,
      productId,
      quantity,
    }));
  },
  async list() {
    const sales = await salesModel.list();
    const salesProducts = await salesProductsModel.list();
    return salesProducts.map(
      ({ sale_id: saleId, product_id: productId, quantity }) => ({
        saleId,
        date: sales.find((sale) => sale.id === saleId).date,
        productId,
        quantity,
      }),
    );
  },
  async add(data) {
    const saleId = await salesModel.add();
    const result = data.map((currProduct) =>
      salesProductsModel.add(
        currProduct.productId,
        saleId,
        currProduct.quantity,
      ));
    await Promise.all(result);
    return saleId;
  },
};

module.exports = salesService;
