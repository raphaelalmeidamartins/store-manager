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
    const data = await salesService.validate.body(req.body);

    const result = data.map(({ productId }) =>
      productsService.exists(productId));
    await Promise.all(result);

    const id = await salesService.add(data);

    res.status(201).json({
      id,
      itemsSold: data.sort((prev, curr) => prev.productId - curr.productId),
    });
  },
  async edit(req, res) {
    const { id } = await salesService.validate.paramsId(req.params);
    const updates = await salesService.validate.body(req.body);

    const result = updates.map(({ productId }) =>
      productsService.exists(productId));
    await Promise.all(result);

    await salesService.exists(id);
    await salesService.edit(id, updates);

    res.status(200).json({
      saleId: id,
      itemsUpdated: updates.sort(
        (prev, curr) => prev.productId - curr.productId,
      ),
    });
  },
  async remove(req, res) {
    const { id } = await salesService.validate.paramsId(req.params);
    await salesService.exists(id);
    await salesService.remove(id);
    res.sendStatus(204);
  },
};

module.exports = salesController;
