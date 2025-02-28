// models/Sheet.js
import mongoose from 'mongoose';

const cellSchema = new mongoose.Schema({
  row: {
    type: Number,
    required: true
  },
  col: {
    type: Number,
    required: true
  },
  value: {
    type: String,
    default: ''
  },
  formula: {
    type: String,
    default: ''
  },
  formatting: {
    bold: { type: Boolean, default: false },
    italic: { type: Boolean, default: false },
    fontSize: { type: Number, default: 12 },
    color: { type: String, default: '#000000' },
    backgroundColor: { type: String, default: '#ffffff' }
  }
});

const sheetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled Spreadsheet'
  },
  userId: {
    type: String,
    required: true
  },
  cells: [cellSchema],
  rowCount: {
    type: Number,
    default: 100
  },
  colCount: {
    type: Number,
    default: 26
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index to make cell lookup more efficient
sheetSchema.index({ 'cells.row': 1, 'cells.col': 1 });

const Sheet = mongoose.model('Sheet', sheetSchema);

export default Sheet;