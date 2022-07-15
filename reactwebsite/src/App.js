import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Collapsible from './components/Collapsible';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Create from './components/Create';
import Manage from './components/Manage';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Collapsible />}/>
          <Route path='/Create' element={<Create />}/>
          <Route path='/Manage' element={<Manage />}/>
        </Routes>

      </Router>
    </>
  );
}

export default App;
