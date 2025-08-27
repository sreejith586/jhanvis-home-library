import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import './App.css';
import './firebase';



const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
const apiKey = import.meta.env.VITE_API_KEY;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="app-container">
      <div className="layout">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Dashboard searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default App;