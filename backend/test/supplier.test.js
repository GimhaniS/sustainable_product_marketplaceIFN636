const chai = require('chai');
const sinon = require('sinon');
const Supplier = require('../models/Supplier');
const { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier } = require('../controllers/SupplierController');
const { expect } = chai;

describe('Supplier Controller', () => {
  afterEach(() => sinon.restore());

  it('createSupplier: 201 on success', async () => {
    const created = { _id: 'x', name: 'S' };
    sinon.stub(Supplier, 'create').resolves(created);
    const req = { user: { id: 'u' }, body: { name: 'S', licenseNumber: 'L1', contactNo: '123' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await createSupplier(req, res);
    expect(res.status.calledWith(201)).to.be.true;
  });

  it('createSupplier: 400 on duplicate license', async () => {
    const err = new Error('dup'); err.code = 11000;
    sinon.stub(Supplier, 'create').throws(err);
    const req = { user: { id: 'u' }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await createSupplier(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('getSuppliers: returns sorted list', async () => {
    const list = [{ name: 'A' }];
    sinon.stub(Supplier, 'find').returns({ sort: sinon.stub().resolves(list) });
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getSuppliers({}, res);
    expect(res.json.calledWith(list)).to.be.true;
  });

  it('getSupplierById: 404 when missing', async () => {
    sinon.stub(Supplier, 'findById').resolves(null);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getSupplierById({ params: { id: 'x' } }, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('updateSupplier: success', async () => {
    const save = sinon.stub().resolves({ name: 'New' });
    sinon.stub(Supplier, 'findById').resolves({ name: 'Old', save });
    const req = { params: { id: 'x' }, body: { name: 'New' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateSupplier(req, res);
    expect(res.json.called).to.be.true;
  });

  it('deleteSupplier: success', async () => {
    const deleteOne = sinon.stub().resolves();
    sinon.stub(Supplier, 'findById').resolves({ deleteOne });
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteSupplier({ params: { id: 'x' } }, res);
    expect(res.json.calledWith({ message: 'Supplier removed' })).to.be.true;
  });
});