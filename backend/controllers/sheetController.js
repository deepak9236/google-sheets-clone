// controllers/sheetController.js
import Sheet from '../models/Sheet.js';

// Create a new sheet
const createSheet = async (req, res) => {
  try {
    const { title, userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const sheet = await Sheet.create({
      title: title || 'Untitled Spreadsheet',
      userId
    });

    res.status(201).json(sheet);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get a sheet by ID
const getSheetById = async (req, res) => {
  try {
    const sheet = await Sheet.findById(req.params.id);
    
    if (!sheet) {
      return res.status(404).json({ message: 'Sheet not found' });
    }
    
    res.status(200).json(sheet);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get all sheets for a user
const getSheetsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const sheets = await Sheet.find({ userId }).sort({ lastModified: -1 });
    
    res.status(200).json(sheets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update cell data
const updateCell = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const { row, col, value, formula, formatting } = req.body;
    
    let sheet = await Sheet.findById(sheetId);
    
    if (!sheet) {
      return res.status(404).json({ message: 'Sheet not found' });
    }
    
    // Find if cell already exists
    const cellIndex = sheet.cells.findIndex(cell => cell.row === row && cell.col === col);
    
    if (cellIndex !== -1) {
      // Update existing cell
      if (value !== undefined) sheet.cells[cellIndex].value = value;
      if (formula !== undefined) sheet.cells[cellIndex].formula = formula;
      if (formatting) {
        sheet.cells[cellIndex].formatting = {
          ...sheet.cells[cellIndex].formatting,
          ...formatting
        };
      }
    } else {
      // Create new cell
      sheet.cells.push({
        row,
        col,
        value: value || '',
        formula: formula || '',
        formatting: formatting || {}
      });
    }
    
    sheet.lastModified = Date.now();
    await sheet.save();
    
    res.status(200).json(sheet);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update multiple cells (for formulas, drag operations, etc.)
const updateCells = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const { cells } = req.body; // Array of cell updates
    
    let sheet = await Sheet.findById(sheetId);
    
    if (!sheet) {
      return res.status(404).json({ message: 'Sheet not found' });
    }
    
    // Process each cell update
    for (const cellUpdate of cells) {
      const { row, col, value, formula, formatting } = cellUpdate;
      
      // Find if cell already exists
      const cellIndex = sheet.cells.findIndex(cell => cell.row === row && cell.col === col);
      
      if (cellIndex !== -1) {
        // Update existing cell
        if (value !== undefined) sheet.cells[cellIndex].value = value;
        if (formula !== undefined) sheet.cells[cellIndex].formula = formula;
        if (formatting) {
          sheet.cells[cellIndex].formatting = {
            ...sheet.cells[cellIndex].formatting,
            ...formatting
          };
        }
      } else {
        // Create new cell
        sheet.cells.push({
          row,
          col,
          value: value || '',
          formula: formula || '',
          formatting: formatting || {}
        });
      }
    }
    
    sheet.lastModified = Date.now();
    await sheet.save();
    
    res.status(200).json(sheet);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update sheet properties
const updateSheet = async (req, res) => {
  try {
    const { title, rowCount, colCount } = req.body;
    
    let sheet = await Sheet.findById(req.params.id);
    
    if (!sheet) {
      return res.status(404).json({ message: 'Sheet not found' });
    }
    
    if (title) sheet.title = title;
    if (rowCount) sheet.rowCount = rowCount;
    if (colCount) sheet.colCount = colCount;
    
    sheet.lastModified = Date.now();
    await sheet.save();
    
    res.status(200).json(sheet);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete a sheet
const deleteSheet = async (req, res) => {
  try {
    //   console.log("🚀 ~ deleteSheet ~ req.params.id:", req.params.id)
    const sheet = await Sheet.findById(req.params.id);
    
    if (!sheet) {
      return res.status(404).json({ message: 'Sheet not found' });
    }
    
    await Sheet.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Sheet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export {
  createSheet,
  getSheetById,
  getSheetsByUser,
  updateCell,
  updateCells,
  updateSheet,
  deleteSheet
};