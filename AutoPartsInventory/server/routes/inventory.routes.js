const express = require('express');
const {
  getAllParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
  getLowStockParts,
  restockPart,
  getStats,
  getByLocation
} = require('../controllers/inventory.controller');
const { validateInventory } = require('../middleware/validate');

const router = express.Router();

router.get('/stats', getStats);
router.get('/locations', getByLocation);
router.get('/low-stock', getLowStockParts);

router.route('/')
  .get(getAllParts)
  .post(validateInventory, createPart);

router.route('/:id')
  .get(getPartById)
  .put(validateInventory, updatePart)
  .delete(deletePart);

router.patch('/:id/restock', restockPart);

module.exports = router;
