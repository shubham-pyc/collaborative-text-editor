import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, } from 'react-router-dom';
import Editor from './editor';
import { v4 as uuidV4} from 'uuid';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} />
        <Route path="/documents/:uuid" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;