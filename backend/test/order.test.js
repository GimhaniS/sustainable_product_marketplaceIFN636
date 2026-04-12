const chai = require('chai');
const sinon = require('sinon');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { getAllOrders, getOrderById, updateOrderStatus, getMyOrders, createOrderFromCart } = require('../../backend/controllers/OrderController');
const { expect } = chai;

// Helper: mock a chainable query (find().populate().populate().sort())
const chainable = (result) => {
  const chain = {};
  chain.populate = sinon.stub().returns(chain);
  chain.sort = sinon.stub().resolves(result);
  return chain;
};

describe('Order Controller', () => {
  afterEach(() => sinon.restore());

  it('getAllOrders: returns all orders', async () => {
    const orders = [{ _id: 'o1' }];
    sinon.stub(Order, 'find').returns(chainable(orders));
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getAllOrders({}, res);
    expect(res.json.calledWith(orders)).to.be.true;
  });

  it('getOrderById: 404 when missing', async () => {
    const chain = { populate: sinon.stub().returnsThis() };
    chain.populate.onSecondCall().resolves(null);
    sinon.stub(Order, 'findById').returns(chain);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getOrderById({ params: { id: 'x' } }, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('updateOrderStatus: 400 on invalid status', async () => {
    const req = { params: { id: 'x' }, body: { status: 'Weird' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateOrderStatus(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('updateOrderStatus: 404 when order missing', async () => {
    sinon.stub(Order, 'findById').resolves(null);
    const req = { params: { id: 'x' }, body: { status: 'Shipped' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateOrderStatus(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('updateOrderStatus: success', async () => {
    const save = sinon.stub().resolves({ status: 'Shipped' });
    sinon.stub(Order, 'findById').resolves({ status: 'Processing', save });
    const req = { params: { id: 'x' }, body: { status: 'Shipped' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateOrderStatus(req, res);
    expect(res.json.called).to.be.true;
  });

  it('getMyOrders: returns current user orders', async () => {
    const orders = [{ _id: 'o1' }];
    sinon.stub(Order, 'find').returns(chainable(orders));
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getMyOrders({ user: { id: 'u1' } }, res);
    expect(res.json.calledWith(orders)).to.be.true;
  });

  it('createOrderFromCart: 400 when cart empty', async () => {
    sinon.stub(Cart, 'findOne').resolves({ items: [] });
    const req = { user: { id: 'u1' }, body: { address: {}, payment: 'card' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await createOrderFromCart(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('createOrderFromCart: creates order and clears cart', async () => {
    const save = sinon.stub().resolves();
    const cart = { items: [{ product: 'p1', name: 'X', imageUrl: '', price: 10, qty: 2 }], save };
    sinon.stub(Cart, 'findOne').resolves(cart);
    const created = { _id: 'o1' };
    sinon.stub(Order, 'create').resolves(created);
    const req = { user: { id: 'u1' }, body: { address: {}, payment: 'card' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await createOrderFromCart(req, res);
    expect(res.status.calledWith(201)).to.be.true;
    expect(cart.items.length).to.equal(0);
  });
});