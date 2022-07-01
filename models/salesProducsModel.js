const db = require('./db');

const salesProductsModel = {
  async get(saleId) {
    const sqlQuery = `
      SELECT *
      FROM StoreManager.sales_products
      WHERE sale_id = ?;
    `;
    const [saleArray] = await db.query(sqlQuery, [saleId]);
    return saleArray;
  },
  async list() {
    const sqlQuery = `
      SELECT *
      FROM StoreManager.sales_products;
    `;
    const [salesArray] = await db.query(sqlQuery);
    return salesArray.sort((prev, curr) => prev.sale_id - curr.sale_id);
  },
  async add(productId, saleId, quantity) {
    const sqlQuery = `
      INSERT INTO StoreManager.sales_products (product_id, sale_id, quantity)
      VALUES
        (?, ?, ?);
    `;

    await db.query(sqlQuery, [productId, saleId, quantity]);
    return saleId;
  },
};

module.exports = salesProductsModel;
