// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from './components/LoginRegister';
import Notes from './components/Notes';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/app" element={<Notes />} />
        <Route path="*" element={<LoginRegister />} /> 
      </Routes>
    </Router>
  );
}

export default App;
