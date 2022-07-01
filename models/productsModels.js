const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
});

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
};

module.exports = { productsModel, db };
