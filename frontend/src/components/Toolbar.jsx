import React, { useContext } from 'react';
import { SheetContext } from '../context/SheetContext';

const Toolbar = () => {
  const { 
    activeSheet, 
    selectedCell, 
    selectionRange, 
    updateCell, 
    updateCells, 
    evaluateFormula 
  } = useContext(SheetContext);
  
  const applyBold = () => {
    if (!activeSheet || !selectedCell) return;
    
    if (selectionRange) {
      const cellUpdates = [];
      for (let row = selectionRange.startRow; row <= selectionRange.endRow; row++) {
        for (let col = selectionRange.startCol; col <= selectionRange.endCol; col++) {
          const cellData = getCellData(row, col);
          const currentFormatting = cellData?.formatting || {};
          
          cellUpdates.push({
            row,
            col,
            value: cellData?.value || '',
            formula: cellData?.formula || '',
            formatting: {
              ...currentFormatting,
              bold: !currentFormatting.bold
            }
          });
        }
      }
      
      updateCells(activeSheet._id, cellUpdates);
    } else {
      const { row, col } = selectedCell;
      const cellData = getCellData(row, col);
      const currentFormatting = cellData?.formatting || {};
      
      updateCell(
        activeSheet._id,
        row,
        col,
        cellData?.value || '',
        cellData?.formula || '',
        {
          ...currentFormatting,
          bold: !currentFormatting.bold
        }
      );
    }
  };
  
  const applyItalic = () => {
    if (!activeSheet || !selectedCell) return;
    
    if (selectionRange) {
      const cellUpdates = [];
      for (let row = selectionRange.startRow; row <= selectionRange.endRow; row++) {
        for (let col = selectionRange.startCol; col <= selectionRange.endCol; col++) {
          const cellData = getCellData(row, col);
          const currentFormatting = cellData?.formatting || {};
          
          cellUpdates.push({
            row,
            col,
            value: cellData?.value || '',
            formula: cellData?.formula || '',
            formatting: {
              ...currentFormatting,
              italic: !currentFormatting.italic
            }
          });
        }
      }
      
      updateCells(activeSheet._id, cellUpdates);
    } else {
      const { row, col } = selectedCell;
      const cellData = getCellData(row, col);
      const currentFormatting = cellData?.formatting || {};
      
      updateCell(
        activeSheet._id,
        row,
        col,
        cellData?.value || '',
        cellData?.formula || '',
        {
          ...currentFormatting,
          italic: !currentFormatting.italic
        }
      );
    }
  };
  
  const changeTextColor = (color) => {
    if (!activeSheet || !selectedCell) return;
    
    if (selectionRange) {
      const cellUpdates = [];
      for (let row = selectionRange.startRow; row <= selectionRange.endRow; row++) {
        for (let col = selectionRange.startCol; col <= selectionRange.endCol; col++) {
          const cellData = getCellData(row, col);
          const currentFormatting = cellData?.formatting || {};
          
          cellUpdates.push({
            row,
            col,
            value: cellData?.value || '',
            formula: cellData?.formula || '',
            formatting: {
              ...currentFormatting,
              color
            }
          });
        }
      }
      
      updateCells(activeSheet._id, cellUpdates);
    } else {
      const { row, col } = selectedCell;
      const cellData = getCellData(row, col);
      const currentFormatting = cellData?.formatting || {};
      
      updateCell(
        activeSheet._id,
        row,
        col,
        cellData?.value || '',
        cellData?.formula || '',
        {
          ...currentFormatting,
          color
        }
      );
    }
  };
  
  const getCellData = (row, col) => {
    if (!activeSheet || !activeSheet.cells) return null;
    return activeSheet.cells.find(cell => cell.row === row && cell.col === col) || null;
  };
  
  const applyFunction = (funcName) => {
    if (!activeSheet || !selectionRange) return;
    
    if (!selectionRange && selectedCell) {
      return;
    }
    
    const startCol = getColumnLetter(selectionRange.startCol);
    const endCol = getColumnLetter(selectionRange.endCol);
    const startRow = selectionRange.startRow + 1; 
    const endRow = selectionRange.endRow + 1; 
    
    const rangeReference = `${startCol}${startRow}:${endCol}${endRow}`;
    const formula = `=${funcName}(${rangeReference})`;
    
    if (selectedCell) {
      const { row, col } = selectedCell;
      updateCell(
        activeSheet._id,
        row,
        col,
        '',
        formula
      );
    }
  };
  
  const getColumnLetter = (columnIndex) => {
    let columnName = '';
    let index = columnIndex;
    
    while (index >= 0) {
      columnName = String.fromCharCode(65 + (index % 26)) + columnName;
      index = Math.floor(index / 26) - 1;
    }
    
    return columnName;
  };
  
  const applyDataQualityFunction = (funcName) => {
    if (!activeSheet || !selectedCell) return;
    
    const { row, col } = selectedCell;
    const cellData = getCellData(row, col);
    const currentValue = cellData?.value || '';
    
    let newValue = currentValue;
    
    switch (funcName) {
      case 'TRIM':
        newValue = currentValue.trim();
        break;
      case 'UPPER':
        newValue = currentValue.toUpperCase();
        break;
      case 'LOWER':
        newValue = currentValue.toLowerCase();
        break;
      default:
        break;
    }
    
    updateCell(
      activeSheet._id,
      row,
      col,
      newValue,
      ''
    );
  };
  
  // Remove duplicates from selected range
  const removeDuplicates = () => {
    if (!activeSheet || !selectionRange) return;
    
    // Get all values in the range
    const rangeValues = [];
    const cellUpdates = [];
    const seenValues = new Set();
    
    // First pass: collect all values
    for (let row = selectionRange.startRow; row <= selectionRange.endRow; row++) {
      const rowValues = [];
      for (let col = selectionRange.startCol; col <= selectionRange.endCol; col++) {
        const cellData = getCellData(row, col);
        rowValues.push(cellData?.value || '');
      }
      rangeValues.push({ row, values: rowValues });
    }
    
    // Second pass: identify and clear duplicates
    for (const rowData of rangeValues) {
      const rowValuesStr = JSON.stringify(rowData.values);
      
      if (seenValues.has(rowValuesStr)) {
        // This is a duplicate, clear the row
        for (let col = selectionRange.startCol; col <= selectionRange.endCol; col++) {
          cellUpdates.push({
            row: rowData.row,
            col,
            value: '',
            formula: '',
          });
        }
      } else {
        seenValues.add(rowValuesStr);
      }
    }
    
    if (cellUpdates.length > 0) {
      updateCells(activeSheet._id, cellUpdates);
    }
  };
  
  // Find and replace function
  const findAndReplace = () => {
    if (!activeSheet || !selectionRange) return;
    
    const findText = prompt('Find what:');
    if (findText === null) return;
    
    const replaceText = prompt('Replace with:');
    if (replaceText === null) return;
    
    const cellUpdates = [];
    
    for (let row = selectionRange.startRow; row <= selectionRange.endRow; row++) {
      for (let col = selectionRange.startCol; col <= selectionRange.endCol; col++) {
        const cellData = getCellData(row, col);
        const currentValue = cellData?.value || '';
        
        if (currentValue.includes(findText)) {
          const newValue = currentValue.replaceAll(findText, replaceText);
          
          cellUpdates.push({
            row,
            col,
            value: newValue,
            formula: cellData?.formula || '',
          });
        }
      }
    }
    
    if (cellUpdates.length > 0) {
      updateCells(activeSheet._id, cellUpdates);
    }
  };
  
  return (
    <div className="toolbar flex items-center p-2 bg-gray-100 border-b border-gray-300">
      <div className="formatting-tools flex items-center space-x-2 mr-4">
        <button 
          onClick={applyBold}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-200"
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        
        <button 
          onClick={applyItalic}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-200"
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        
        <select 
          onChange={(e) => changeTextColor(e.target.value)}
          className="px-2 py-1 bg-white border border-gray-300 rounded"
          title="Text Color"
        >
          <option value="#000000">Color</option>
          <option value="#000000">Black</option>
          <option value="#FF0000">Red</option>
          <option value="#00FF00">Green</option>
          <option value="#0000FF">Blue</option>
        </select>
      </div>
      
      <div className="function-tools flex items-center space-x-2 mr-4">
        <select 
          onChange={(e) => applyFunction(e.target.value)}
          className="px-2 py-1 bg-white border border-gray-300 rounded"
          title="Math Functions"
        >
          <option value="">Math Functions</option>
          <option value="SUM">SUM</option>
          <option value="AVERAGE">AVERAGE</option>
          <option value="MAX">MAX</option>
          <option value="MIN">MIN</option>
          <option value="COUNT">COUNT</option>
        </select>
      </div>
      
      <div className="data-quality-tools flex items-center space-x-2">
        <select 
          onChange={(e) => applyDataQualityFunction(e.target.value)}
          className="px-2 py-1 bg-white border border-gray-300 rounded"
          title="Data Functions"
        >
          <option value="">Data Functions</option>
          <option value="TRIM">TRIM</option>
          <option value="UPPER">UPPER</option>
          <option value="LOWER">LOWER</option>
        </select>
        
        <button 
          onClick={removeDuplicates}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-200"
          title="Remove Duplicates"
        >
          Remove Duplicates
        </button>
        
        <button 
          onClick={findAndReplace}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-200"
          title="Find and Replace"
        >
          Find & Replace
        </button>
      </div>
    </div>
  );
};

export default Toolbar;