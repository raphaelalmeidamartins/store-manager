const salesService = require('../services/salesService');
const productsService = require('../services/productsService');

const salesController = {
  async get(req, res) {
    const { id } = await salesService.validate.paramsId(req.params);

    await salesService.exists(id);
    const saleProducts = await salesService.get(id);

    res.status(200).json(saleProducts);
  },
  async list(_req, res) {
    const sales = await salesService.list();
    res.status(200).json(sales);
  },
  async add(req, res) {
    const data = await salesService.validate.bodyAdd(req.body);

    const result = data.map(({ productId }) => productsService.exists(productId));
    await Promise.all(result);

    const id = await salesService.add(data);

    res.status(201).json({
      id,
      itemsSold: data.sort((prev, curr) => prev.productId - curr.productId),
    });
  },
};

module.exports = salesController;
