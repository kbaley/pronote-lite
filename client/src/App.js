import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Dashboard from './Dashboard';
import PrintableTimetable from './PrintableTimetable';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/print" element={<PrintableTimetable />} />
      </Routes>
    </Router>
  );
}

export default App;
