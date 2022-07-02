const { expect, use } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const NotFoundError = require('../../../errors/NotFoundError');
const productsModel = require('../../../models/productsModel');
const productsService = require('../../../services/productsService');

use(chaiAsPromised);

describe('Test the productsService layer', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('Check the `validate` methods', () => {
    describe('Check the `paramsId` method', () => {
      it('should return a valid object if the `id` is valid', () => {
        const object = productsService.validate.paramsId({ id: 1 });
        expect(object).to.deep.equal({ id: 1 });
      });

      it('should throw an error if the `id` is not valid', () => {
        expect(() => productsService.validate.paramsId({ id: 'a' })).to.throw(
          '"id" must be a number'
        );
      });
    });
  });

  describe('Check the `exists` method', () => {
    it('should return `true` if the product corresponding to the provided `id` exists', async () => {
      sinon.stub(productsModel, 'exists').resolves(true);
      const exists = await productsService.exists(1);
      expect(exists).to.be.undefined;
    });

    it('should throw not found error if the product corresponding to the provided `id`does not exists', async () => {
      sinon.stub(productsModel, 'exists').resolves(false);

      return expect(productsService.exists(1)).to.eventually.be.rejectedWith(
        'Product not found'
      );
    });
  });

  describe('Check the `get` method', () => {
    it('should return the product corresponding to the provied `id`', async () => {
      const mockedProduct = { id: 1, name: 'Martelo de Tor' };
      sinon.stub(productsModel, 'get').resolves(mockedProduct);
      const product = await productsService.get(1);
      expect(product).to.deep.equal(mockedProduct);
    });

    it('should return undefined if there is no product with the provided `id`', async () => {
      sinon.stub(productsModel, 'get').resolves(undefined);
      const product = await productsService.get(1001);
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
      sinon.stub(productsModel, 'list').resolves(mockedProducts);
      const product = await productsService.list();
      expect(product).to.deep.equal(mockedProducts);
    });

    it('should return an empty array if there is no product registered in the database', async () => {
      const mockedProducts = [];
      sinon.stub(productsModel, 'list').resolves(mockedProducts);
      const product = await productsService.list();
      expect(product).to.deep.equal(mockedProducts);
    });
  });

  describe('Check the `add` method', () => {
    it('should return the insert id', async () => {
      const insertId = 3;
      sinon.stub(productsModel, 'add').resolves(insertId);
      const id = await productsService.add({ name: 'Caixa de pandora' });
      expect(id).to.equal(insertId);
    });
  });

  describe('Check the `edit` method', () => {
    it('should return true if it is succesful', async () => {
      const id = 1;
      sinon.stub(productsModel, 'edit').resolves(true);
      const done = await productsService.edit(id, {
        name: 'Mario Galaxy 2 Wii',
      });
      expect(done).to.be.true;
    });

    it('should return false if it is not succesful', async () => {
      const id = 1;
      sinon.stub(productsModel, 'edit').resolves(false);
      const done = await productsService.edit(id, {
        name: 'Mario Galaxy 2 Wii',
      });
      expect(done).to.be.false;
    });
  });

  describe('Check the `remove` method', () => {
    it('should return true if it is succesful', async () => {
      const id = 1;
      sinon.stub(productsModel, 'remove').resolves(true);
      const done = await productsService.remove(id);
      expect(done).to.be.true;
    });

    it('should return false if it is not succesful', async () => {
      const id = 1;
      sinon.stub(productsModel, 'remove').resolves(false);
      const done = await productsService.remove(id);
      expect(done).to.be.false;
    });
  });

  describe('Check the `search` method', () => {
    it('should return an array of product objects corresponding to the search term', async () => {
      const mockedProducts = [
        { id: 1, name: 'Martelo de Tor' },
        { id: 2, name: 'Sapatos do Sonic' },
        { id: 3, name: 'Caixa de pandora' },
      ];
      const searchTerm = 'thor';
      const searchProducts = mockedProducts.filter(({ name }) =>
        name.match(new RegExp(searchTerm, 'i'))
      );
      sinon.stub(productsModel, 'search').resolves(searchProducts);
      const products = await productsService.search(searchTerm);
      expect(products).to.deep.equal(searchProducts);
    });

    it('should return an empty array if there is no product corresponding to the search term', async () => {
      const mockedProducts = [
        { id: 1, name: 'Martelo de Tor' },
        { id: 2, name: 'Sapatos do Sonic' },
        { id: 3, name: 'Caixa de pandora' },
      ];
      const searchTerm = 'raphael';
      const searchProducts = mockedProducts.filter(({ name }) =>
        name.match(new RegExp(searchTerm, 'i'))
      );
      sinon.stub(productsModel, 'search').resolves(searchProducts);
      const products = await productsService.search(searchTerm);
      expect(products).to.deep.equal(searchProducts);
    });
  });
});
