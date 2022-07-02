const { expect, use } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/db');
const salesModel = require('../../../models/salesModel');

use(chaiAsPromised);

describe('Test the salesModel layer', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('Check the `exists` method', () => {
    it('should return `true` if the sale corresponding to the provided `id` exists', async () => {
      sinon.stub(db, 'query').resolves([[{ id: 1, date: new Date('09/08/2019') }]]);
      const exists = await salesModel.exists(1);
      expect(exists).to.be.true;
    });

    it('should return `false` if the sale corresponding to the provided `id`does not exists', async () => {
      sinon.stub(db, 'query').resolves([[undefined]]);
      const exists = await salesModel.exists(1);
      expect(exists).to.be.false;
    });
  });

  describe('Check the `get` method', () => {
    it('should return the sale corresponding to the provied `id`', async () => {
      const mockedSale = { id: 1, date: new Date('01/12/2021') };
      sinon.stub(db, 'query').resolves([[mockedSale]]);
      const sale = await salesModel.get(1);
      expect(sale).to.deep.equal(mockedSale);
    });

    it('should return undefined if there is no sale with the provided `id`', async () => {
      sinon.stub(db, 'query').resolves([[undefined]]);
      const sale = await salesModel.get(1001);
      expect(sale).to.be.undefined;
    });
  });

  describe('Check the `list` method', () => {
    it('should return an array of product objects', async () => {
      const mockedSales = [
        { id: 1, date: new Date('08/16/2021') },
        { id: 2, date: new Date('01/12/2021') },
        { id: 3, date: new Date('08/09/2019') },
      ];
      sinon.stub(db, 'query').resolves([mockedSales]);
      const sales = await salesModel.list();
      expect(sales).to.deep.equal(mockedSales);
    });

    it('should return an empty array if there is no product registered in the database', async () => {
      const mockedSales = [];
      sinon.stub(db, 'query').resolves([mockedSales]);
      const sale = await salesModel.list();
      expect(sale).to.deep.equal(mockedSales);
    });
  });

  describe('Check the `add` method', () => {
    it('should return the insert id', async () => {
      const insertId = 3;
      sinon.stub(db, 'query').resolves([{ insertId }]);
      const id = await salesModel.add({ name: 'Caixa de pandora' });
      expect(id).to.equal(insertId);
    });
  });
});
