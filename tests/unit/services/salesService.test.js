const { expect, use } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const NotFoundError = require('../../../errors/NotFoundError');
const salesModel = require('../../../models/salesModel');
const salesProductsModel = require('../../../models/salesProductsModel');
const salesService = require('../../../services/salesService');

use(chaiAsPromised);

describe('Test the salesService layer', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('Check the `validate` methods', () => {
    describe('Check the `paramsId` method', () => {
      it('should return a valid object if the `id` is valid', () => {
        const object = salesService.validate.paramsId({ id: 1 });
        expect(object).to.deep.equal({ id: 1 });
      });

      it('should throw an error if the `id` is not valid', () => {
        expect(() => salesService.validate.paramsId({ id: 'a' })).to.throw(
          '"id" must be a number'
        );
      });
    });

    describe('Check the `bodyAdd` method', () => {
      it('should return a valid object if the `productId` is valid', () => {
        const body = [{ productId: 1, quantity: 5 }];
        const object = salesService.validate.bodyAdd(body);
        expect(object).to.deep.equal(body);
      });

      it('should throw an error if the `productId` is not a number', () => {
        const body = [{ productId: 'abc', quantity: 5 }];
        expect(() => salesService.validate.bodyAdd(body)).to.throw(
          '"productId" must be a number'
        );
      });

      it('should throw an error if the `productId` is not positive', () => {
        const body = [{ productId: -1, quantity: 5 }];
        expect(() => salesService.validate.bodyAdd(body)).to.throw(
          '"productId" must be a positive number'
        );
      });

      it('should throw an error if the `productId` is not an integer', () => {
        const body = [{ productId: 1.2, quantity: 5 }];
        expect(() => salesService.validate.bodyAdd(body)).to.throw(
          '"productId" must be an integer'
        );
      });

      it('should throw an error if the `productId` is not provided', () => {
        const body = [{ quantity: 5 }];
        expect(() => salesService.validate.bodyAdd(body)).to.throw(
          '"productId" is required'
        );
      });

      it('should throw an error if the `quantity` is not a number', () => {
        const body = [{ productId: 5, quantity: 'abc' }];
        expect(() => salesService.validate.bodyAdd(body)).to.throw(
          '"quantity" must be a number'
        );
      });

      it('should throw an error if the `quantity` is not greater than or equal to 1', () => {
        const body = [{ productId: 1, quantity: -5 }];
        expect(() => salesService.validate.bodyAdd(body)).to.throw(
          '"quantity" must be greater than or equal to 1'
        );
      });

      it('should throw an error if the `quantity` is not an integer', () => {
        const body = [{ productId: 1, quantity: 5.2 }];
        expect(() => salesService.validate.bodyAdd(body)).to.throw(
          '"quantity" must be an integer'
        );
      });

      it('should throw an error if the `quantity` is not provided', () => {
        const body = [{ productId: 5 }];
        expect(() => salesService.validate.bodyAdd(body)).to.throw(
          '"quantity" is required'
        );
      });
    });
  });

  describe('Check the `exists` method', () => {
    it('should return `true` if the sale corresponding to the provided `id` exists', async () => {
      sinon.stub(salesModel, 'exists').resolves(true);
      const exists = await salesService.exists(1);
      expect(exists).to.be.undefined;
    });

    it('should throw not found error if the sale corresponding to the provided `id`does not exists', async () => {
      sinon.stub(salesModel, 'exists').resolves(false);

      return expect(salesService.exists(1)).to.eventually.be.rejectedWith(
        'Sale not found'
      );
    });
  });

  describe('Check the `get` method', () => {
    it('should return the sale corresponding to the provied `id`', async () => {
      const date = new Date('08/16/2021');
      const mockedSales = { id: 1, date };
      const mockedSalesProducts = [
        { sale_id: 1, product_id: 1, quantity: 3 },
        { sale_id: 1, product_id: 2, quantity: 6 },
        { sale_id: 1, product_id: 1, quantity: 5 },
      ];

      const mockedReturn = [
        { date, productId: 1, quantity: 3 },
        { date, productId: 2, quantity: 6 },
        { date, productId: 1, quantity: 5 },
      ];

      sinon.stub(salesModel, 'get').resolves(mockedSales);
      sinon.stub(salesProductsModel, 'list').resolves(mockedSalesProducts);

      const sale = await salesService.get(1);

      expect(sale).to.deep.equal(mockedReturn);
    });
  });

  describe('Check the `list` method', () => {
    it('should return an array of sale objects', async () => {
      const date1 = new Date('08/16/2021');
      const date2 = new Date('01/12/2021');
      const date3 = new Date('08/09/2019');

      const mockedSales = [
        { id: 1, date: date1 },
        { id: 2, date: date2 },
        { id: 3, date: date3 },
      ];

      const mockedSalesProducts = [
        { sale_id: 1, product_id: 1, quantity: 3 },
        { sale_id: 2, product_id: 2, quantity: 6 },
        { sale_id: 3, product_id: 1, quantity: 5 },
      ];

      const mockedReturn = [
        { saleId: 1, date: date1, productId: 1, quantity: 3 },
        { saleId: 2, date: date2, productId: 2, quantity: 6 },
        { saleId: 3, date: date3, productId: 1, quantity: 5 },
      ];

      sinon.stub(salesModel, 'list').resolves(mockedSales);
      sinon.stub(salesProductsModel, 'list').resolves(mockedSalesProducts);

      const sale = await salesService.list();

      expect(sale).to.deep.equal(mockedReturn);
    });

    it('should return an empty array if there is no sale registered in the database', async () => {
      const mockedSales = [];

      const mockedSalesProducts = [];

      const mockedReturn = [];

      sinon.stub(salesModel, 'list').resolves(mockedSales);
      sinon.stub(salesProductsModel, 'list').resolves(mockedSalesProducts);

      const sale = await salesService.list();

      expect(sale).to.deep.equal(mockedReturn);
    });
  });

  describe('Check the `add` method', () => {
    it('should return the insert id', async () => {
      const data = [
        {
          productId: 1,
          quantity: 2,
        },
        {
          productId: 99999,
          quantity: 5,
        },
      ];

      const saleId = 3;

      sinon.stub(salesModel, 'add').resolves(saleId);
      sinon.stub(salesProductsModel, 'add').resolves(saleId);

      const id = await salesService.add(data);

      expect(id).to.equal(saleId);
    });
  });
});
