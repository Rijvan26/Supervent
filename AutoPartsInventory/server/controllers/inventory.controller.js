const Inventory = require('../models/Inventory');
const Category = require('../models/Category');

exports.getAllParts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.supplier) {
      query.supplier = req.query.supplier;
    }

    if (req.query.warehouse) {
      query['location.warehouse'] = req.query.warehouse;
    }

    let results = Inventory.find(query).populate('category supplier');

    if (req.query.sortBy) {
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      results = results.sort({ [req.query.sortBy]: sortOrder });
    } else {
      results = results.sort({ createdAt: -1 });
    }

    let parts = await results;

    // Filter by status if provided (requires virtual)
    if (req.query.status) {
      parts = parts.filter(part => part.status === req.query.status);
    }

    const total = parts.length;
    const paginatedParts = parts.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      count: paginatedParts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: paginatedParts
    });
  } catch (error) {
    next(error);
  }
};

exports.getPartById = async (req, res, next) => {
  try {
    const part = await Inventory.findById(req.params.id).populate('category supplier');
    if (!part) {
      return res.status(404).json({ success: false, message: 'Part not found' });
    }
    res.status(200).json({ success: true, data: part });
  } catch (error) {
    next(error);
  }
};

exports.createPart = async (req, res, next) => {
  try {
    const part = await Inventory.create(req.body);
    res.status(201).json({ success: true, data: part });
  } catch (error) {
    next(error);
  }
};

exports.updatePart = async (req, res, next) => {
  try {
    const part = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!part) {
      return res.status(404).json({ success: false, message: 'Part not found' });
    }
    res.status(200).json({ success: true, data: part });
  } catch (error) {
    next(error);
  }
};

exports.deletePart = async (req, res, next) => {
  try {
    const part = await Inventory.findByIdAndDelete(req.params.id);
    if (!part) {
      return res.status(404).json({ success: false, message: 'Part not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

exports.getLowStockParts = async (req, res, next) => {
  try {
    const parts = await Inventory.find({ $expr: { $lte: ['$quantity', '$minStockLevel'] } }).populate('category supplier');
    res.status(200).json({ success: true, count: parts.length, data: parts });
  } catch (error) {
    next(error);
  }
};

exports.restockPart = async (req, res, next) => {
  try {
    if (!req.body.addQuantity || req.body.addQuantity <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid addQuantity' });
    }
    const part = await Inventory.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ success: false, message: 'Part not found' });
    }
    part.quantity += req.body.addQuantity;
    await part.save();
    res.status(200).json({ success: true, data: part });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const parts = await Inventory.find();
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    parts.forEach(part => {
      totalValue += (part.quantity * part.costPrice);
      if (part.quantity === 0) outOfStockCount++;
      else if (part.quantity <= part.minStockLevel) lowStockCount++;
    });

    const totalCategories = await Category.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalParts: parts.length,
        totalValue,
        lowStockCount,
        outOfStockCount,
        totalCategories
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getByLocation = async (req, res, next) => {
  try {
    const parts = await Inventory.aggregate([
      {
        $group: {
          _id: { warehouse: '$location.warehouse', shelf: '$location.shelf', bin: '$location.bin' },
          parts: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.warehouse': 1, '_id.shelf': 1, '_id.bin': 1 }
      }
    ]);
    res.status(200).json({ success: true, data: parts });
  } catch (error) {
    next(error);
  }
};
