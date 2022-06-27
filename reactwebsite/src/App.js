import React from 'react';
import useCollapse from 'react-collapsed';
import './App.css';
import Navbar from './components/Navbar';
import Body from './components/Body';
import Collapsible from './components/Collapsible';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' />
        </Routes>
        
        <Collapsible />

      </Router>
    </>
  );
}

export default App;
