const { expect, use } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { ValidationError } = require('joi');
const sinon = require('sinon');
const NotFoundError = require('../../../errors/NotFoundError');
const salesService = require('../../../services/salesService');
const salesController = require('../../../controllers/salesController');
const productsService = require('../../../services/productsService');

use(chaiAsPromised);

describe('Test the salesController layer', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('Check the `get` method', () => {
    it('should return the sale corresponding to the provied `id`', async () => {
      const mockedSale = [
        { date: new Date('08/16/2021'), productId: 1, quantity: 5 },
      ];

      const req = {};
      const res = {};

      req.params = { id: 1 };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(salesService, 'exists');
      sinon.stub(salesService, 'get').resolves(mockedSale);

      await salesController.get(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockedSale)).to.be.true;
    });

    it('should return error message if the `id` is invalid with status 400', async () => {
      const req = {};
      const res = {};

      req.params = { id: 'abc' };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      return expect(
        salesController.get(req, res)
      ).to.eventually.be.rejectedWith(ValidationError);
    });
  });

  describe('Check the `list` method', () => {
    it('should return an array of sale objects', async () => {
      const mockedSales = [
        { saleId: 1, date: new Date('08/16/2021'), productId: 1, quantity: 5 },
        { saleId: 1, date: new Date('08/16/2021'), productId: 2, quantity: 2 },
        { saleId: 1, date: new Date('08/26/2021'), productId: 1, quantity: 7 },
        { saleId: 2, date: new Date('07/09/2020'), productId: 3, quantity: 3 },
        { saleId: 3, date: new Date('10/08/2019'), productId: 4, quantity: 6 },
      ];

      const req = {};
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(salesService, 'list').resolves(mockedSales);

      await salesController.list(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockedSales)).to.be.true;
    });

    it('should return an empty array if there is no sale registered in the database', async () => {
      const mockedSales = [];

      const req = {};
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(salesService, 'list').resolves(mockedSales);

      await salesController.list(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockedSales)).to.be.true;
    });
  });

  describe('Check the `add` method', () => {
    it('should respond the request with the inserterd sale', async () => {
      const req = {};
      const res = {};

      req.body = [
        {
          productId: 1,
          quantity: 1,
        },
        {
          productId: 3,
          quantity: 5,
        },
      ];
      const id = 2;
      const sale = { id, itemsSold: req.body };

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub();

      sinon.stub(productsService, 'exists');
      sinon.stub(salesService, 'add').resolves(id);
      sinon.stub(salesService, 'get').resolves(sale);

      await salesController.add(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(sale)).to.be.true;
    });
  });
});
