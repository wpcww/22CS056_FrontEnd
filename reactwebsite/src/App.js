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
  const [name, setName] = useState("")
  const [struct, setStruct] = useState(
    {
      "0":{
      "Predecessor":null,
      "Successor":[]
      }
    }
  )

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Collapsible />}/>
          <Route path='/Create' element={<Create name={name} setName={setName} struct={struct} setStruct={setStruct} />}/>
          <Route path='/Manage' element={<Manage name={name} setName={setName} struct={struct} setStruct={setStruct} />}/>
        </Routes>

      </Router>
    </>
  );
}

export default App;
