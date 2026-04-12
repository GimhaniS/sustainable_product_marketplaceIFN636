const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Category = require('../models/Category');
const { createCategory, getCategories, getCategoryById, deleteCategory } = require('../controllers/CategoryController')
const { expect } = chai;

describe('Category Controller', () => {
  afterEach(() => sinon.restore());

  it('createCategory: should return 201', async () => {
    const created = { _id: 'x', label: 'Eco' };
    sinon.stub(Category, 'create').resolves(created);
    const req = { user: { id: 'u1' }, body: { label: 'Eco' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await createCategory(req, res);
    expect(res.status.calledWith(201)).to.be.true;
  });

  it('getCategories: should return list', async () => {
    const list = [{ label: 'A' }];
    sinon.stub(Category, 'find').resolves(list);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getCategories({}, res);
    expect(res.json.calledWith(list)).to.be.true;
  });

  it('getCategoryById: 404 when not found', async () => {
    sinon.stub(Category, 'findById').resolves(null);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getCategoryById({ params: { id: 'x' } }, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('deleteCategory: success', async () => {
    const deleteOne = sinon.stub().resolves();
    sinon.stub(Category, 'findById').resolves({ deleteOne });
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteCategory({ params: { id: 'x' } }, res);
    expect(res.json.calledWith({ message: 'Category removed' })).to.be.true;
  });

  it('deleteCategory: 404 when not found', async () => {
    sinon.stub(Category, 'findById').resolves(null);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteCategory({ params: { id: 'x' } }, res);
    expect(res.status.calledWith(404)).to.be.true;
  });
});