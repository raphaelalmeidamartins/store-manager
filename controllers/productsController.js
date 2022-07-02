const productsService = require('../services/productsService');

const productsController = {
  async get(req, res) {
    const { id } = await productsService.validate.paramsId(req.params);

    await productsService.exists(id);
    const product = await productsService.get(id);

    res.status(200).json(product);
  },
  async list(_req, res) {
    const products = await productsService.list();
    res.status(200).json(products);
  },
  async add(req, res) {
    const data = await productsService.validate.body(req.body);
    const id = await productsService.add(data);
    const product = await productsService.get(id);
    res.status(201).json(product);
  },
  async edit(req, res) {
    const { id } = await productsService.validate.paramsId(req.params);

    await productsService.exists(id);
    const updates = await productsService.validate.body(req.body);
    await productsService.edit(id, updates);

    const product = await productsService.get(id);

    res.status(200).json(product);
  },
};

module.exports = productsController;
