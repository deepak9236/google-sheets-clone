import React, { createContext, useState, useEffect } from 'react';
import { mathFunctions } from '../utils/mathFunctions';
import { dataValidation } from '../utils/dataValidation';

export const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
  const [activeSheet, setActiveSheet] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectionRange, setSelectionRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // API base URL
  const API_URL = 'http://localhost:5000/api/sheets';
  
  // Fetch all sheets for a user
  const fetchSheetsByUser = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/user/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sheets');
      }
      
      const data = await response.json();
      setSheets(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  
  // Fetch a sheet by ID
  const fetchSheetById = async (sheetId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/${sheetId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sheet');
      }
      
      const data = await response.json();
      setActiveSheet(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  
  // Create a new sheet
  const createSheet = async (title, userId) => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create sheet');
      }
      
      const data = await response.json();
      setSheets([...sheets, data]);
      setActiveSheet(data);
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return null;
    }
  };
  
  // Update a cell
  const updateCell = async (sheetId, row, col, value, formula, formatting) => {
    try {
      const response = await fetch(`${API_URL}/${sheetId}/cell`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ row, col, value, formula, formatting }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update cell');
      }
      
      const data = await response.json();
      setActiveSheet(data);
    } catch (error) {
      setError(error.message);
    }
  };
  
  // Update multiple cells
  const updateCells = async (sheetId, cells) => {
    try {
      const response = await fetch(`${API_URL}/${sheetId}/cells`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cells }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update cells');
      }
      
      const data = await response.json();
      setActiveSheet(data);
    } catch (error) {
      setError(error.message);
    }
  };
  
  // Update sheet properties
  const updateSheet = async (sheetId, { title, rowCount, colCount }) => {
    try {
      const response = await fetch(`${API_URL}/${sheetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, rowCount, colCount }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update sheet');
      }
      
      const data = await response.json();
      setActiveSheet(data);
      
      // Update sheet in sheets list
      const updatedSheets = sheets.map(sheet => 
        sheet._id === sheetId ? data : sheet
      );
      setSheets(updatedSheets);
    } catch (error) {
      setError(error.message);
    }
  };
  
  // Delete a sheet
  const deleteSheet = async (sheetId) => {
    try {
      const response = await fetch(`${API_URL}/${sheetId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete sheet');
      }
      
      // Remove from sheets list
      const updatedSheets = sheets.filter(sheet => sheet._id !== sheetId);
      setSheets(updatedSheets);
      
      // Clear active sheet if it was deleted
      if (activeSheet && activeSheet._id === sheetId) {
        setActiveSheet(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  // Evaluate a formula
  const evaluateFormula = (formula, currentRow, currentCol) => {
    if (!formula || !formula.startsWith('=')) return formula;
    
    try {
      // Extract the function name and range
      const match = formula.match(/=([A-Z]+)\(([A-Z0-9:]+)\)/i);
      if (!match) return '#ERROR!';
      
      const [, funcName, rangeStr] = match;
      
      // Parse the range (e.g., A1:C3)
      const range = parseRange(rangeStr);
      if (!range) return '#RANGE!';
      
      // Get all cell values in the range
      const values = getCellValuesInRange(range.startRow, range.startCol, range.endRow, range.endCol);
      
      // Apply the function
      switch (funcName.toUpperCase()) {
        case 'SUM':
          return mathFunctions.sum(values).toString();
        case 'AVERAGE':
          return mathFunctions.average(values).toString();
        case 'MAX':
          return mathFunctions.max(values).toString();
        case 'MIN':
          return mathFunctions.min(values).toString();
        case 'COUNT':
          return mathFunctions.count(values).toString();
        default:
          return '#FUNC!';
      }
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return '#ERROR!';
    }
  };
  
  // Parse a range reference (e.g., "A1:C3")
  const parseRange = (rangeStr) => {
    // Handle single cell reference
    if (!rangeStr.includes(':')) {
      const cellRef = parseCell(rangeStr);
      return {
        startRow: cellRef.row,
        startCol: cellRef.col,
        endRow: cellRef.row,
        endCol: cellRef.col
      };
    }
    
    // Handle range reference
    const [start, end] = rangeStr.split(':');
    const startCell = parseCell(start);
    const endCell = parseCell(end);
    
    if (!startCell || !endCell) return null;
    
    return {
      startRow: startCell.row,
      startCol: startCell.col,
      endRow: endCell.row,
      endCol: endCell.col
    };
  };
  
  // Parse a cell reference (e.g., "A1" to {row: 0, col: 0})
  const parseCell = (cellRef) => {
    const match = cellRef.match(/([A-Z]+)([0-9]+)/i);
    if (!match) return null;
    
    const [, colStr, rowStr] = match;
    const row = parseInt(rowStr, 10) - 1; // Convert to 0-based
    const col = colStrToIndex(colStr);
    
    return { row, col };
  };
  
  // Convert column string to index (e.g., "A" to 0, "Z" to 25, "AA" to 26)
  const colStrToIndex = (colStr) => {
    let result = 0;
    for (let i = 0; i < colStr.length; i++) {
      result = result * 26 + (colStr.charCodeAt(i) - 64);
    }
    return result - 1; // Convert to 0-based
  };
  
  // Get all cell values in a range
  const getCellValuesInRange = (startRow, startCol, endRow, endCol) => {
    if (!activeSheet) return [];
    
    const values = [];
    
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const cell = activeSheet.cells.find(c => c.row === row && c.col === col);
        
        if (cell) {
          // If the cell has a formula, recursively evaluate it
          if (cell.formula) {
            values.push(evaluateFormula(cell.formula, row, col));
          } else {
            values.push(cell.value);
          }
        } else {
          values.push('');
        }
      }
    }
    
    return values;
  };
  
  return (
    <SheetContext.Provider
      value={{
        activeSheet,
        sheets,
        selectedCell,
        selectionRange,
        loading,
        error,
        setSelectedCell,
        setSelectionRange,
        fetchSheetsByUser,
        fetchSheetById,
        createSheet,
        updateCell,
        updateCells,
        updateSheet,
        deleteSheet,
        evaluateFormula
      }}
    >
      {children}
    </SheetContext.Provider>
  );
};