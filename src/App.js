import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Create from "./components/Create";
// import Manage from "./components/Manage";
import Collapsible from "./components/Collapsible";
import Organization from "./components/Organization";

function App() {
  const [state, setState] = useState({
    nameField: "",
    structField: {
      0: {
        Predecessor: null,
        Successor: [],
      },
    },
  });

  const data = useRef({
    0: ["", ""],
  });

  const [orgRef, setOrg]= useState({
    oCode: "",
    pkstr: ""
  })

  const structClone = useRef({
    0: {
      Predecessor: null,
      Successor: [],
    },
  });

  const redir = () =>{
    return orgRef.pkstr === undefined || orgRef.pkstr === ""
  }

  return (
    <>
      <Router>
        <Navbar 
          orgRef={orgRef}
          setOrg={setOrg}
        />
        <Routes>
          <Route path="/" element={
              <Organization
                orgRef={orgRef}
                setOrg={setOrg}
              />
            } 
          />
          <Route 
            path="/Authenticate"
            element={
              redir()
              ?<Navigate to="/"/>
              :<Collapsible 
                orgRef={orgRef}
                setOrg={setOrg}
                />}
          />
          <Route
            path="/Create"
            element={
              redir()
              ?<Navigate to="/"/>
              :<Create
                state={state}
                setState={setState}
                structClone={structClone}
                data={data}
                orgRef={orgRef}
              />
            }
          />
          {/* <Route
            path="/Manage"
            element={
              <Manage
                state={state}
                setState={setState}
                structClone={structClone}
                data={data}
              />
            }
          /> */}
        </Routes>
      </Router>
    </>
  );


}



export default App;
