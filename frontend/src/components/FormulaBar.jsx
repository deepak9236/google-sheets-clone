import React, { useState, useEffect, useContext } from 'react';
import { SheetContext } from '../context/SheetContext';

const FormulaBar = () => {
  const { 
    activeSheet, 
    selectedCell, 
    updateCell, 
    evaluateFormula 
  } = useContext(SheetContext);
  
  const [formulaInput, setFormulaInput] = useState('');
  const [cellReference, setCellReference] = useState('');
  
  useEffect(() => {
    if (selectedCell && activeSheet) {
      const { row, col } = selectedCell;
      const cellData = activeSheet.cells.find(
        cell => cell.row === row && cell.col === col
      );
      
      if (cellData) {
        setFormulaInput(cellData.formula || cellData.value || '');
      } else {
        setFormulaInput('');
      }
      
      const colLetter = getColumnLetter(col);
      setCellReference(`${colLetter}${row + 1}`);
    }
  }, [selectedCell, activeSheet]);
  
  const getColumnLetter = (columnIndex) => {
    let columnName = '';
    let index = columnIndex;
    
    while (index >= 0) {
      columnName = String.fromCharCode(65 + (index % 26)) + columnName;
      index = Math.floor(index / 26) - 1;
    }
    
    return columnName;
  };
  
  const handleInputChange = (e) => {
    setFormulaInput(e.target.value);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && selectedCell && activeSheet) {
      const { row, col } = selectedCell;
      const isFormula = formulaInput.startsWith('=');
      
      updateCell(
        activeSheet._id,
        row,
        col,
        isFormula ? '' : formulaInput, 
        isFormula ? formulaInput : '' 
      );
    }
  };
  
  const handleBlur = () => {
    if (selectedCell && activeSheet) {
      const { row, col } = selectedCell;
      const isFormula = formulaInput.startsWith('=');
      
      updateCell(
        activeSheet._id,
        row,
        col,
        isFormula ? '' : formulaInput, 
        isFormula ? formulaInput : '' 
      );
    }
  };
  
  return (
    <div className="formula-bar flex items-center border border-gray-300 bg-white my-1">
      <div className="cell-reference px-2 py-1 border-r border-gray-300 bg-gray-100 font-medium">
        {cellReference}
      </div>
      <div className="formula-input-container flex-1">
        <input
          type="text"
          className="w-full px-2 py-1 outline-none"
          value={formulaInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Enter formula or value"
        />
      </div>
    </div>
  );
};

export default FormulaBar;