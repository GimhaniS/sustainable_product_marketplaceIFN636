const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerUser, loginUser, getProfile, updateUserProfile } = require('../controllers/authController');
const { expect } = chai;

describe('Auth Controller', () => {
  afterEach(() => sinon.restore());

  describe('registerUser', () => {
    it('should return 400 if fields missing', async () => {
      const req = { body: { name: 'A' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await registerUser(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 400 if user exists', async () => {
      sinon.stub(User, 'findOne').resolves({ _id: 'x' });
      const req = { body: { name: 'A', email: 'a@b.com', password: '123456' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await registerUser(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should create user and return 201', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves({ id: '1', name: 'A', email: 'a@b.com', role: 'customer' });
      sinon.stub(jwt, 'sign').returns('fake-token');
      const req = { body: { name: 'A', email: 'a@b.com', password: '123456' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await registerUser(req, res);
      expect(res.status.calledWith(201)).to.be.true;
    });
  });

  describe('loginUser', () => {
    it('should return 400 if email or password missing', async () => {
      const req = { body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await loginUser(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 401 on bad credentials', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      const req = { body: { email: 'a@b.com', password: 'x' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await loginUser(req, res);
      expect(res.status.calledWith(401)).to.be.true;
    });

    it('should login successfully', async () => {
      sinon.stub(User, 'findOne').resolves({ id: '1', name: 'A', email: 'a@b.com', password: 'hashed', role: 'customer' });
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('tok');
      const req = { body: { email: 'a@b.com', password: '123456' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await loginUser(req, res);
      expect(res.json.called).to.be.true;
    });
  });

  describe('getProfile', () => {
    it('should return 404 if user not found', async () => {
      sinon.stub(User, 'findById').resolves(null);
      const req = { user: { id: 'x' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await getProfile(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return profile', async () => {
      sinon.stub(User, 'findById').resolves({ id: '1', name: 'A', email: 'a@b.com', role: 'customer' });
      const req = { user: { id: '1' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await getProfile(req, res);
      expect(res.json.called).to.be.true;
    });
  });

  describe('updateUserProfile', () => {
    it('should update and return user', async () => {
      const saveStub = sinon.stub().resolves({ id: '1', name: 'New', email: 'a@b.com', role: 'customer' });
      sinon.stub(User, 'findById').resolves({ id: '1', name: 'Old', email: 'a@b.com', save: saveStub });
      sinon.stub(jwt, 'sign').returns('tok');
      const req = { user: { id: '1' }, body: { name: 'New' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await updateUserProfile(req, res);
      expect(res.json.called).to.be.true;
    });
  });
});