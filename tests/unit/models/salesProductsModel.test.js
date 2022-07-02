const { expect, use } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/db');
const salesProductsModel = require('../../../models/salesProductsModel');

use(chaiAsPromised);

describe('Test the salesProductsModel layer', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('Check the `getBySaleId` method', () => {
    it('should return the sales corresponding to the provied `saleId`', async () => {
      const mockedSale = { sale_id: 1, product_id: 2, quantity: 5 };
      sinon.stub(db, 'query').resolves([mockedSale]);
      const sale = await salesProductsModel.getBySaleId(1);
      expect(sale).to.deep.equal(mockedSale);
    });

    it('should return undefined if there is no sale with the provided `id`', async () => {
      sinon.stub(db, 'query').resolves([undefined]);
      const sale = await salesProductsModel.getBySaleId(1001);
      expect(sale).to.be.undefined;
    });
  });

  describe('Check the `getByProductId` method', () => {
    it('should return the sales corresponding to the provied `producId`', async () => {
      const mockedSale = { sale_id: 1, product_id: 2, quantity: 5 };
      sinon.stub(db, 'query').resolves([mockedSale]);
      const sale = await salesProductsModel.getByProductId(2);
      expect(sale).to.deep.equal(mockedSale);
    });

    it('should return undefined if there is no sale with the provided `id`', async () => {
      sinon.stub(db, 'query').resolves([undefined]);
      const sale = await salesProductsModel.getByProductId(1001);
      expect(sale).to.be.undefined;
    });
  });

  describe('Check the `list` method', () => {
    it('should return an array of product objects', async () => {
      const mockedSales = [
        { sale_id: 1, product_id: 2, quantity: 5 },
        { sale_id: 2, product_id: 5, quantity: 8 },
        { sale_id: 3, product_id: 2, quantity: 9 },
      ];
      sinon.stub(db, 'query').resolves([mockedSales]);
      const sales = await salesProductsModel.list();
      expect(sales).to.deep.equal(mockedSales);
    });

    it('should return an empty array if there is no product registered in the database', async () => {
      const mockedSales = [];
      sinon.stub(db, 'query').resolves([mockedSales]);
      const sale = await salesProductsModel.list();
      expect(sale).to.deep.equal(mockedSales);
    });
  });

  describe('Check the `add` method', () => {
    it('should return the insert id', async () => {
      const productId = 2;
      const saleId = 3;
      const quantity = 5;
      sinon.stub(db, 'query');
      const id = await salesProductsModel.add(productId, saleId, quantity);
      expect(id).to.equal(saleId);
    });
  });
});
