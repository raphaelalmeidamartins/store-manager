const { expect, use } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { ValidationError } = require('joi');
const sinon = require('sinon');
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

      const req = { params: { id: 1 }};
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(productsService, 'get').resolves(mockedProduct);

      await productsController.get(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockedProduct)).to.be.true;
    });

    it('should return error message if the `id` is invalid with status 400', () => {
      const req = { params: { id: 'abc' }};
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(mockedProduct);

      sinon.stub(productsService, 'get');

      await productsController.get(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: '"id" must be a number' })).to.be.true;
    });
  });

  describe('Check the `list` method', () => {
    it('should return an array of product objects', () => {
      const mockedProducts = [
        { id: 1, name: 'Martelo de Tor' },
        { id: 2, name: 'Sapatos do Sonic' },
        { id: 3, name: 'Caixa de pandora' },
      ];

      const req = {};
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      await productsController.list(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockedProducts)).to.be.true;
    });

    it('should return an empty array if there is no product registered in the database', () => {
      const mockedProducts = [];

      const req = {};
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      await productsController.list(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockedProducts)).to.be.true;
    });
  });
});
