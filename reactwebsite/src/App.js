import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Body from './components/Body';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' />
        </Routes>
        <Body />

      </Router>
    </>
  );
}

export default App;
