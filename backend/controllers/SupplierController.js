const Supplier = require('../models/Supplier');

//  CREATE
const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(supplier);
  } catch (error) {
    // Handle duplicate licenseNumber
    if (error.code === 11000) {
      return res.status(400).json({ message: 'License number already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

//  READ ALL
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  READ ONE
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  UPDATE
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    Object.assign(supplier, req.body);

    const updated = await supplier.save();
    res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'License number already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

//  DELETE
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    await supplier.deleteOne();

    res.json({ message: 'Supplier removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};