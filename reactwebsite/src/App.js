import React, { useState , useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Collapsible from './components/Collapsible';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Create from './components/Create';
import Manage from './components/Manage';

function App() {
  const [state, setState] = useState({
    nameField:"",
    structField:{
      "0":{
      "Predecessor":null,
      "Successor":[]
      }
    }
  })

  const data = useRef(
    {
      "0":["",""]
    }
  )

  const structClone = useRef(
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
          <Route path='/Create' element={<Create state={state} setState={setState} structClone={structClone} data={data} />}/>
          <Route path='/Manage' element={<Manage state={state} setState={setState} structClone={structClone} data={data} />}/>
        </Routes>

      </Router>
    </>
  );
}

export default App;
