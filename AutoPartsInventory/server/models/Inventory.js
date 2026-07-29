const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  partNumber: {
    type: String,
    required: [true, 'Part number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Part name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  costPrice: {
    type: Number,
    required: [true, 'Cost price is required'],
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    default: 0,
    min: 0
  },
  minStockLevel: {
    type: Number,
    default: 5,
    min: 0
  },
  location: {
    warehouse: String,
    shelf: String,
    bin: String
  },
  compatibleVehicles: [{
    type: String
  }],
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

inventorySchema.virtual('status').get(function() {
  if (this.quantity === 0) return 'Out of Stock';
  if (this.quantity <= this.minStockLevel) return 'Low Stock';
  return 'In Stock';
});

inventorySchema.index({ name: 'text', partNumber: 'text' });

module.exports = mongoose.model('Inventory', inventorySchema);
