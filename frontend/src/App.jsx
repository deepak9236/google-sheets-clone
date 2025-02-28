import React from 'react';
import { SheetProvider } from './context/SheetContext';
import Home from './pages/Home';
import './index.css';

function App() {
  return (
    <SheetProvider>
      <div className="app">
        <Home />
      </div>
    </SheetProvider>
  );
}

export default App;