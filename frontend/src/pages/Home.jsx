import React, { useState, useEffect, useContext } from 'react';
import { SheetContext } from '../context/SheetContext';
import Toolbar from '../components/Toolbar';
import FormulaBar from '../components/FormulaBar';
import Spreadsheet from '../components/Spreadsheet';

const Home = () => {
  const { 
    sheets, 
    activeSheet, 
    fetchSheetsByUser, 
    fetchSheetById, 
    createSheet, 
    deleteSheet, 
    loading, 
    error,
    updateSheet
  } = useContext(SheetContext);
  
  const [userId, setUserId] = useState('user123'); // Demo user ID
  
  // Load user's sheets on component mount
  useEffect(() => {
    fetchSheetsByUser(userId);
  }, [userId]);
  
  // Create a new sheet
  const handleCreateSheet = () => {
    const title = prompt('Enter sheet title:') || 'Untitled Spreadsheet';
    createSheet(title, userId);
  };
  
  // Open a sheet
  const handleOpenSheet = (sheetId) => {
    fetchSheetById(sheetId);
  };
  
  // Delete a sheet
  const handleDeleteSheet = (sheetId, e) => {
    e.stopPropagation(); // Prevent opening the sheet
    
    if (window.confirm('Are you sure you want to delete this sheet?')) {
      deleteSheet(sheetId);
    }
  };
  
  return (
    <div className="home-container mx-auto p-4 max-w-7xl">
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Google Sheets Clone</h1>
        
        <div className="sheet-controls flex items-center space-x-2">
          <select 
            className="px-3 py-2 border border-gray-300 rounded"
            value={activeSheet?._id || ''}
            onChange={(e) => handleOpenSheet(e.target.value)}
          >
            <option value="">Select a sheet</option>
            {sheets.map(sheet => (
              <option key={sheet._id} value={sheet._id}>
                {sheet.title}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleCreateSheet}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            New Sheet
          </button>
        </div>
      </header>
      
      {loading && <div className="text-center py-4">Loading...</div>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {activeSheet && (
        <div className="sheet-container">
          <div className="sheet-header mb-2 flex justify-between items-center">
            <h2 className="text-xl font-semibold">{activeSheet.title}</h2>
            <button
              onClick={() => {
                const newTitle = prompt('Enter new title:', activeSheet.title);
                if (newTitle) {
                  updateSheet(activeSheet._id, { title: newTitle });
                }
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              Rename
            </button>
          </div>
          
          <div className="sheet-workspace border border-gray-300 rounded shadow-sm bg-white">
            <Toolbar />
            <FormulaBar />
            <Spreadsheet />
          </div>
        </div>
      )}
      
      {!activeSheet && !loading && (
        <div className="sheet-list mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Spreadsheets</h2>
          
          {sheets.length === 0 ? (
            <div className="text-gray-500">
              No spreadsheets found. Create a new one to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sheets.map(sheet => (
                <div
                  key={sheet._id}
                  onClick={() => handleOpenSheet(sheet._id)}
                  className="sheet-card p-4 border border-gray-300 rounded shadow-sm bg-white cursor-pointer hover:shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{sheet.title}</h3>
                      <p className="text-sm text-gray-500">
                        Last modified: {new Date(sheet.lastModified).toLocaleString()}
                      </p>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteSheet(sheet._id, e)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;