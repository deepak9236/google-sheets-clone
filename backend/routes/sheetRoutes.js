// routes/sheetRoutes.js
import express from 'express';
import {
  createSheet,
  getSheetById,
  getSheetsByUser,
  updateCell,
  updateCells,
  updateSheet,
  deleteSheet
} from '../controllers/sheetController.js';

const router = express.Router();

// Create a new sheet
router.post('/', createSheet);

// Get a sheet by ID
router.get('/:id', getSheetById);

// Get all sheets for a user
router.get('/user/:userId', getSheetsByUser);

// Update a cell
router.put('/:sheetId/cell', updateCell);

// Update multiple cells
router.put('/:sheetId/cells', updateCells);

// Update sheet properties
router.put('/:id', updateSheet);

// Delete a sheet
router.delete('/:id', deleteSheet);

export default router;