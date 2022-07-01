const { expect, use } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/db');
const productsModel = require('../../../models/productsModel');

use(chaiAsPromised);

describe('Test the productsModel layer', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('Check the `exists` method', () => {
    it('should return `true` if the product corresponding to the provided `id` exists', async () => {
      sinon.stub(db, 'query').resolves([[{ id: 1, name: 'Martelo de Tor' }]]);
      const exists = await productsModel.exists(1);
      expect(exists).to.be.true;
    });

    it('should return `false` if the product corresponding to the provided `id`does not exists', async () => {
      sinon.stub(db, 'query').resolves([[undefined]]);
      const exists = await productsModel.exists(1);
      expect(exists).to.be.false;
    });
  });

  describe('Check the `get` method', () => {
    it('should return the product corresponding to the provied `id`', async () => {
      const mockedProduct = { id: 1, name: 'Martelo de Tor' };
      sinon.stub(db, 'query').resolves([[mockedProduct]]);
      const product = await productsModel.get(1);
      expect(product).to.deep.equal(mockedProduct);
    });

    it('should return undefined if there is no product with the provided `id`', async () => {
      sinon.stub(db, 'query').resolves([[undefined]]);
      const product = await productsModel.get(1001);
      expect(product).to.be.undefined;
    });
  });

  describe('Check the `list` method', () => {
    it('should return an array of product objects', async () => {
      const mockedProducts = [
        { id: 1, name: 'Martelo de Tor' },
        { id: 2, name: 'Sapatos do Sonic' },
        { id: 3, name: 'Caixa de pandora' },
      ];
      sinon.stub(db, 'query').resolves([mockedProducts]);
      const product = await productsModel.list();
      expect(product).to.deep.equal(mockedProducts);
    });

    it('should return an empty array if there is no product registered in the database', async () => {
      const mockedProducts = [];
      sinon.stub(db, 'query').resolves([mockedProducts]);
      const product = await productsModel.list();
      expect(product).to.deep.equal(mockedProducts);
    });
  });

  describe('Check the `add` method', () => {
    it('should return the insert id', async () => {
      const insertId = 3;
      sinon.stub(db, 'query').resolves([{ insertId }]);
      const id = await productsModel.add({ name: 'Caixa de pandora' });
      expect(id).to.equal(insertId);
    });
  });
});
