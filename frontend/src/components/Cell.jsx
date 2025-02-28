import React, { useState, useEffect, useRef, useContext } from 'react';
import { SheetContext } from '../context/SheetContext';

const Cell = ({ 
  row, 
  col, 
  cellData, 
  isSelected, 
  onSelect, 
  onDragStart, 
  onDragOver, 
  onDragEnd 
}) => {
  const { activeSheet, updateCell, evaluateFormula } = useContext(SheetContext);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const cellRef = useRef(null);
  const inputRef = useRef(null);
  
  const value = cellData?.value || '';
  const formula = cellData?.formula || '';
  const formatting = cellData?.formatting || {};
  
  const displayValue = formula ? evaluateFormula(formula, row, col) : value;
  
  useEffect(() => {
    if (isEditing) {
      setInputValue(formula || value);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing, formula, value]);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  
  const handleClick = (e) => {
    onSelect(e);
  };
  
  const handleBlur = () => {
    saveChanges();
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      saveChanges();
      
      if (e.key === 'Enter') {
        const nextRow = Math.min(row + 1, activeSheet?.rowCount - 1 || 99);
        const cellBelow = document.querySelector(`[data-row="${nextRow}"][data-col="${col}"]`);
        cellBelow?.click();
      } else if (e.key === 'Tab') {
        const nextCol = Math.min(col + 1, activeSheet?.colCount - 1 || 25);
        const cellRight = document.querySelector(`[data-row="${row}"][data-col="${nextCol}"]`);
        cellRight?.click();
      }
    }
    
    if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(formula || value);
    }
  };
  
  const saveChanges = () => {
    if (!isEditing) return;
    
    const isFormula = inputValue.startsWith('=');
    
    if (activeSheet) {
      updateCell(
        activeSheet._id, 
        row, 
        col, 
        isFormula ? '' : inputValue, 
        isFormula ? inputValue : '', 
        formatting 
      );
    }
    
    setIsEditing(false);
  };
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const getCellStyle = () => {
    return {
      fontWeight: formatting.bold ? 'bold' : 'normal',
      fontStyle: formatting.italic ? 'italic' : 'normal',
      fontSize: formatting.fontSize ? `${formatting.fontSize}px` : '14px',
      color: formatting.color || 'black',
      backgroundColor: formatting.backgroundColor || 'white',
      textAlign: formatting.textAlign || 'left',
      width: '100px',
      minWidth: '100px',
      height: '24px'
    };
  };
  
  const handleMouseDown = (e) => {
    if (e.button === 0) {
      onDragStart();
    }
  };
  
  const handleMouseEnter = (e) => {
    if (e.buttons === 1) { 
      onDragOver();
    }
  };
  
  const handleMouseUp = () => {
    onDragEnd();
  };
  
  return (
    <div
      ref={cellRef}
      className={`cell relative border-b border-r border-gray-300 ${isSelected ? 'selected bg-blue-100 outline outline-2 outline-blue-500 z-10' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
      style={getCellStyle()}
      data-row={row}
      data-col={col}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="cell-input absolute inset-0 w-full h-full px-1 py-0 outline-none"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div className="cell-content px-1 py-0 w-full h-full overflow-hidden text-sm">
          {displayValue}
        </div>
      )}
    </div>
  );
};

export default Cell;