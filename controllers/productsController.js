const productsService = require('../services/productsService');
const NotFoundError = require('../errors/NotFoundError');

const productsController = {
  async get(req, res) {
    const { id } = await productsService.validate.paramsId(req.params);

    await productsService.exists(id);
    const product = await productsService.get(id);

    if (!product) throw new NotFoundError('Product not found');

    res.status(200).json(product);
  },
  async list(_req, res) {
    const products = await productsService.list();
    res.json(products);
  },
  async add(req, res) {
    const data = await productsService.validate.bodyAdd(req.body);
    const id = await productsService.add(data);
    const product = await productsService.get(id);
    res.status(201).json(product);
  },
};

module.exports = productsController;
