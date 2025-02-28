import React, { useState, useEffect, useContext, useRef } from 'react';
import Cell from './Cell';
import { SheetContext } from '../context/SheetContext';

const Spreadsheet = () => {
  const { 
    activeSheet, 
    updateCell, 
    updateCells, 
    updateSheet,
    setSelectedCell: setContextSelectedCell,
    setSelectionRange: setContextSelectionRange
  } = useContext(SheetContext);
  
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectionRange, setSelectionRange] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState(null);
  const spreadsheetRef = useRef(null);
  
  const rowCount = activeSheet?.rowCount || 100;
  const colCount = activeSheet?.colCount || 26;
  
  useEffect(() => {
    setContextSelectedCell(selectedCell);
  }, [selectedCell, setContextSelectedCell]);

  useEffect(() => {
    setContextSelectionRange(selectionRange);
  }, [selectionRange, setContextSelectionRange]);
  
  const generateColumnHeader = (index) => {
    let header = '';
    while (index >= 0) {
      header = String.fromCharCode(65 + (index % 26)) + header;
      index = Math.floor(index / 26) - 1;
    }
    return header;
  };
  
  const getCellData = (row, col) => {
    if (!activeSheet || !activeSheet.cells) return null;
    return activeSheet.cells.find(cell => cell.row === row && cell.col === col) || null;
  };
  
  const handleCellSelect = (row, col, event) => {
    if (event.shiftKey && selectedCell) {
      const minRow = Math.min(selectedCell.row, row);
      const maxRow = Math.max(selectedCell.row, row);
      const minCol = Math.min(selectedCell.col, col);
      const maxCol = Math.max(selectedCell.col, col);
      
      setSelectionRange({
        startRow: minRow,
        startCol: minCol,
        endRow: maxRow,
        endCol: maxCol
      });
    } else {
      setSelectedCell({ row, col });
      setSelectionRange(null);
      setDragStartCell(null);
    }
  };
  
  const handleDragStart = (row, col) => {
    setIsDragging(true);
    setDragStartCell({ row, col });
  };
  
  const handleDragOver = (row, col) => {
    if (isDragging && dragStartCell) {
      const minRow = Math.min(dragStartCell.row, row);
      const maxRow = Math.max(dragStartCell.row, row);
      const minCol = Math.min(dragStartCell.col, col);
      const maxCol = Math.max(dragStartCell.col, col);
      
      setSelectionRange({
        startRow: minRow,
        startCol: minCol,
        endRow: maxRow,
        endCol: maxCol
      });
    }
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const isCellSelected = (row, col) => {
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      return true;
    }
    
    if (selectionRange) {
      return (
        row >= selectionRange.startRow &&
        row <= selectionRange.endRow &&
        col >= selectionRange.startCol &&
        col <= selectionRange.endCol
      );
    }
    
    return false;
  };
  
  const renderColumnHeaders = () => {
    const headers = [];
    headers.push(
      <div 
        key="corner" 
        className="cell header corner-header bg-gray-200 border-b border-r border-gray-300 sticky left-0 z-20"
        style={{ width: '50px', minWidth: '50px' }}
      />
    );
    
    for (let col = 0; col < colCount; col++) {
      headers.push(
        <div 
          key={`col-${col}`} 
          className="cell header col-header bg-gray-200 border-b border-r border-gray-300 text-center select-none sticky top-0 z-10"
          style={{ width: '100px', minWidth: '100px' }}
        >
          {generateColumnHeader(col)}
        </div>
      );
    }
    
    return <div className="column-headers flex sticky top-0 z-20">{headers}</div>;
  };
  
  const renderRows = () => {
    const rows = [];
    
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const cells = [];
      
      cells.push(
        <div 
          key={`row-${rowIndex}`} 
          className="cell header row-header bg-gray-200 border-b border-r border-gray-300 text-center select-none sticky left-0 z-10"
          style={{ width: '50px', minWidth: '50px' }}
        >
          {rowIndex + 1}
        </div>
      );
      
      for (let colIndex = 0; colIndex < colCount; colIndex++) {
        const cellData = getCellData(rowIndex, colIndex);
        cells.push(
          <Cell
            key={`cell-${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            cellData={cellData}
            isSelected={isCellSelected(rowIndex, colIndex)}
            onSelect={(e) => handleCellSelect(rowIndex, colIndex, e)}
            onDragStart={() => handleDragStart(rowIndex, colIndex)}
            onDragOver={() => handleDragOver(rowIndex, colIndex)}
            onDragEnd={handleDragEnd}
          />
        );
      }
      
      rows.push(
        <div key={`row-container-${rowIndex}`} className="row flex">
          {cells}
        </div>
      );
    }
    
    return rows;
  };
  
  const addRow = () => {
    if (activeSheet) {
      const newRowCount = rowCount + 1;
      updateSheet(activeSheet._id, { rowCount: newRowCount });
    }
  };
  
  const addColumn = () => {
    if (activeSheet) {
      const newColCount = colCount + 1;
      updateSheet(activeSheet._id, { colCount: newColCount });
    }
  };

  const batchUpdateCells = (cellsData) => {
    if (activeSheet && cellsData.length > 0) {
      updateCells(activeSheet._id, cellsData);
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedCell) return;
      
      const { row, col } = selectedCell;
      
      switch (event.key) {
        case 'ArrowUp':
          if (row > 0) setSelectedCell({ row: row - 1, col });
          break;
        case 'ArrowDown':
          if (row < rowCount - 1) setSelectedCell({ row: row + 1, col });
          break;
        case 'ArrowLeft':
          if (col > 0) setSelectedCell({ row, col: col - 1 });
          break;
        case 'ArrowRight':
          if (col < colCount - 1) setSelectedCell({ row, col: col + 1 });
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, rowCount, colCount]);
  
  return (
    <div className="spreadsheet-container h-full flex flex-col">
      <div className="controls sticky top-0 flex gap-2 p-2 bg-white border-b border-gray-300 z-30">
        <button 
          onClick={addRow}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Row
        </button>
        <button 
          onClick={addColumn}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Column
        </button>
      </div>
      
      <div 
        className="spreadsheet-wrapper flex-1 overflow-auto" 
        ref={spreadsheetRef}
      >
        <div className="spreadsheet-inner min-w-full">
          {renderColumnHeaders()}
          {renderRows()}
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;