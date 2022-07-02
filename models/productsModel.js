const db = require('./db');

const productsModel = {
  async exists(id) {
    const sqlQuery = `
      SELECT *
      FROM StoreManager.products
      WHERE id = ?;
    `;
    const [[product]] = await db.query(sqlQuery, [id]);
    return Boolean(product);
  },
  async get(id) {
    const sqlQuery = `
      SELECT *
      FROM StoreManager.products
      WHERE id = ?;
    `;
    const [[product]] = await db.query(sqlQuery, [id]);
    return product;
  },
  async list() {
    const sqlQuery = `
      SELECT *
      FROM StoreManager.products;
    `;
    const [products] = await db.query(sqlQuery);
    return products.sort((prev, curr) => prev.id - curr.id);
  },
  async add(data) {
    const sqlQuery = `
      INSERT INTO StoreManager.products (name)
      VALUES
        (?);
    `;
    const [{ insertId }] = await db.query(sqlQuery, [data.name]);
    return insertId;
  },
  async edit(id, updates) {
    const sqlQuery = `
      UPDATE StoreManager.products
      SET ?
      WHERE id = ?;
    `;
    const [{ affectedRows }] = await db.query(sqlQuery, [updates, id]);
    return Boolean(affectedRows);
  },
  async remove(id) {
    const sqlQuery = `
      DELETE FROM StoreManager.products
      WHERE id = ?;
    `;
    const [{ affectedRows }] = await db.query(sqlQuery, [id]);
    return Boolean(affectedRows);
  },
  async search(searchTerm) {
    const sqlQuery = `
      SELECT *
      FROM StoreManager.products
      WHERE name REGEXP ?;
    `;
    const [products] = await db.query(sqlQuery, [searchTerm]);
    return products.sort((prev, curr) => prev.id - curr.id);
  },
};

module.exports = productsModel;
