const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { expect } = chai;

describe('Product Controller', () => {
  afterEach(() => sinon.restore()); // cleans up stubs between tests

  describe('createProduct', () => {
    it('should create a product and return 201', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { name: 'Eco Bag', price: 20, materialCategory: 'eco_friendly' },
      };
      const created = { _id: new mongoose.Types.ObjectId(), ...req.body, createdBy: req.user.id };
      sinon.stub(Product, 'create').resolves(created);

      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await createProduct(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(created)).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Product, 'create').throws(new Error('DB error'));
      const req = { user: { id: 'x' }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await createProduct(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('getProducts', () => {
    it('should return all products', async () => {
      const fake = [{ name: 'A' }, { name: 'B' }];
      sinon.stub(Product, 'find').resolves(fake);
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await getProducts({}, res);
      expect(res.json.calledWith(fake)).to.be.true;
    });
  });

  describe('getProductById', () => {
    it('should return 404 when not found', async () => {
      sinon.stub(Product, 'findById').resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await getProductById(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return product when found', async () => {
      const fake = { _id: 'x', name: 'Bag' };
      sinon.stub(Product, 'findById').resolves(fake);
      const req = { params: { id: 'x' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await getProductById(req, res);
      expect(res.json.calledWith(fake)).to.be.true;
    });
  });

  describe('updateProduct', () => {
    it('should update and return product', async () => {
      const saveStub = sinon.stub().resolves({ name: 'Updated' });
      sinon.stub(Product, 'findById').resolves({ name: 'Old', save: saveStub });
      const req = { params: { id: 'x' }, body: { name: 'Updated' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await updateProduct(req, res);
      expect(res.json.called).to.be.true;
    });

    it('should return 404 when not found', async () => {
      sinon.stub(Product, 'findById').resolves(null);
      const req = { params: { id: 'x' }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await updateProduct(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe('deleteProduct', () => {
    it('should delete product', async () => {
      const deleteOneStub = sinon.stub().resolves();
      sinon.stub(Product, 'findById').resolves({ deleteOne: deleteOneStub });
      const req = { params: { id: 'x' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await deleteProduct(req, res);
      expect(res.json.calledWith({ message: 'Product removed' })).to.be.true;
    });

    it('should return 404 when not found', async () => {
      sinon.stub(Product, 'findById').resolves(null);
      const req = { params: { id: 'x' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await deleteProduct(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});