const { expect, use } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { ValidationError } = require('joi');
const sinon = require('sinon');
const NotFoundError = require('../../../errors/NotFoundError');
const productsService = require('../../../services/productsService');
const productsController = require('../../../controllers/productsController');

use(chaiAsPromised);

describe('Test the productsController layer', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('Check the `get` method', () => {
    it('should return the product corresponding to the provied `id`', async () => {
      const mockedProduct = { id: 1, name: 'Martelo de Tor' };

      const req = {};
      const res = {};

      req.params = { id: 1 };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(productsService, 'exists');
      sinon.stub(productsService, 'get').resolves(mockedProduct);

      await productsController.get(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockedProduct)).to.be.true;
    });

    it('should return error message if the `id` is invalid with status 400', async () => {
      const req = {};
      const res = {};

      req.params = { id: 'abc' };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      return expect(
        productsController.get(req, res)
      ).to.eventually.be.rejectedWith(ValidationError);
    });
  });

  describe('Check the `list` method', () => {
    it('should return an array of product objects', async () => {
      const mockedProducts = [
        { id: 1, name: 'Martelo de Tor' },
        { id: 2, name: 'Sapatos do Sonic' },
        { id: 3, name: 'Caixa de pandora' },
      ];

      const req = {};
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(productsService, 'list').resolves(mockedProducts);

      await productsController.list(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockedProducts)).to.be.true;
    });

    it('should return an empty array if there is no product registered in the database', async () => {
      const mockedProducts = [];

      const req = {};
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(productsService, 'list').resolves(mockedProducts);

      await productsController.list(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockedProducts)).to.be.true;
    });
  });

  describe('Check the `add` method', () => {
    it('should respond the request with the inserterd product', async () => {
      const req = {};
      const res = {};

      req.body = { name: 'Caixa de pandora' };
      req.params = { id: 1 };
      const product = { id: req.params.id, ...req.body };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(productsService, 'add').resolves(req.params.id);
      sinon.stub(productsService, 'get').resolves(product);

      await productsController.add(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(product)).to.be.true;
    });
  });

  describe('Check the `edit` method', () => {
    it('should respond the request with the edited product', async () => {
      const req = {};
      const res = {};

      req.body = { name: 'Caixa de pandora' };
      req.params = { id: 1 };
      const product = { id: req.params.id, ...req.body };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(productsService, 'exists');
      sinon.stub(productsService, 'edit').resolves(true);
      sinon.stub(productsService, 'get').resolves(product);

      await productsController.edit(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(product)).to.be.true;
    });
  });

  describe('Check the `remove` method', () => {
    it('should send 204 status if it is succesful', async () => {
      const req = {};
      const res = {};

      req.params = { id: 1 };

      res.status = sinon.stub().returns(res);
      res.sendStatus = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(productsService, 'exists');
      sinon.stub(productsService, 'remove').resolves(true);

      await productsController.remove(req, res);

      expect(res.sendStatus.calledWith(204)).to.be.true;
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

      const req = {};
      const res = {};

      req.query = { q: searchTerm };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(productsService, 'list').resolves(mockedProducts);
      sinon.stub(productsService, 'search').resolves(searchProducts);

      await productsController.search(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(searchProducts)).to.be.true;
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

      const req = {};
      const res = {};

      req.query = { q: searchTerm };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(productsService, 'list').resolves(mockedProducts);
      sinon.stub(productsService, 'search').resolves(searchProducts);

      await productsController.search(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(searchProducts)).to.be.true;
    });

    it('should list all the products if the search team is empty', async () => {
      const mockedProducts = [
        { id: 1, name: 'Martelo de Tor' },
        { id: 2, name: 'Sapatos do Sonic' },
        { id: 3, name: 'Caixa de pandora' },
      ];
      const searchTerm = '';

      const req = {};
      const res = {};

      req.query = { q: searchTerm };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(productsService, 'list').resolves(mockedProducts);
      sinon.stub(productsService, 'search').resolves(mockedProducts);

      await productsController.search(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockedProducts)).to.be.true;
    });
  });
});
