import React, { useState, useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Collapsible from './components/Collapsible';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Create from './components/Create';
import Manage from './components/Manage';

function App() {
  const [passRecord, setPass] = useState(1)
  const passRecord2 = useRef(1)

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Collapsible />}/>
          <Route path='/Create' element={<Create passRecord={passRecord} setPass={setPass} passRecord2={passRecord2}/>}/>
          <Route path='/Manage' element={<Manage passRecord={passRecord} setPass={setPass} passRecord2={passRecord2}/>}/>
        </Routes>

      </Router>
    </>
  );
}

export default App;
