const db = require('./db');

const salesModel = {
  async exists(id) {
    const sqlQuery = `
      SELECT *
      FROM StoreManager.sales
      WHERE id = ?;
    `;
    const [[sale]] = await db.query(sqlQuery, [id]);
    return Boolean(sale);
  },
  async get(id) {
    const sqlQuery = `
      SELECT *
      FROM StoreManager.sales
      WHERE id = ?;
    `;
    const [[sale]] = await db.query(sqlQuery, [id]);
    return sale;
  },
  async list() {
    const sqlQuery = `
      SELECT *
      FROM StoreManager.sales;
    `;
    const [sales] = await db.query(sqlQuery);
    return sales.sort((prev, curr) => prev.id - curr.id);
  },
  async add() {
    const sqlQuery = `
      INSERT INTO StoreManager.sales (date)
      VALUES
        (?);
    `;
    const date = new Date();

    const [{ insertId }] = await db.query(sqlQuery, [date]);
    return insertId;
  },
};

module.exports = salesModel;
