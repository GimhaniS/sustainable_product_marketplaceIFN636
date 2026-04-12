const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../../backend/controllers/CartController')
const { expect } = chai;

describe('Cart Controller', () => {
  afterEach(() => sinon.restore());

  it('getCart: returns existing cart', async () => {
    const cart = { user: 'u1', items: [] };
    sinon.stub(Cart, 'findOne').resolves(cart);
    const res = { json: sinon.spy() };
    await getCart({ user: { id: 'u1' } }, res);
    expect(res.json.calledWith(cart)).to.be.true;
  });

  it('getCart: creates cart if none exists', async () => {
    sinon.stub(Cart, 'findOne').resolves(null);
    const newCart = { user: 'u1', items: [] };
    sinon.stub(Cart, 'create').resolves(newCart);
    const res = { json: sinon.spy() };
    await getCart({ user: { id: 'u1' } }, res);
    expect(res.json.calledWith(newCart)).to.be.true;
  });

  it('addToCart: adds a new item', async () => {
    const save = sinon.stub().resolves();
    const cart = { user: 'u1', items: [], save };
    sinon.stub(Cart, 'findOne').resolves(cart);
    const req = { user: { id: 'u1' }, body: { productId: new mongoose.Types.ObjectId().toString(), name: 'X', price: 10, qty: 1 } };
    const res = { json: sinon.spy() };
    await addToCart(req, res);
    expect(cart.items.length).to.equal(1);
    expect(save.calledOnce).to.be.true;
  });

  it('updateCartItem: 404 when item not in cart', async () => {
    const save = sinon.stub().resolves();
    sinon.stub(Cart, 'findOne').resolves({ items: [], save });
    const req = { user: { id: 'u1' }, body: { productId: 'p1', qty: 2 } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateCartItem(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('removeFromCart: filters item out', async () => {
    const save = sinon.stub().resolves();
    const cart = { items: [{ product: { toString: () => 'p1' } }, { product: { toString: () => 'p2' } }], save };
    sinon.stub(Cart, 'findOne').resolves(cart);
    const req = { user: { id: 'u1' }, params: { productId: 'p1' } };
    const res = { json: sinon.spy() };
    await removeFromCart(req, res);
    expect(cart.items.length).to.equal(1);
  });
});