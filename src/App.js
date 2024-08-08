import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ProteinViewer from './components/ProteinViewer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ProteinViewer" element={<ProteinViewer/>} />
      </Routes>
    </Router>
  );
};

export default App;
