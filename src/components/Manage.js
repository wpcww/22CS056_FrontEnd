import React, { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import Fab from "@mui/material/Fab";
import PublishIcon from "@mui/icons-material/Publish";
import "./Manage.css";

function Manage({ state, setState, structClone, data }) {
  const [record, getData] = useState([]);
  const [org, setOrg] = useState([]);
  const URL = "https://8in207fxt2.execute-api.us-east-1.amazonaws.com/dev/organization";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(URL)
      .then((res) => res.json())
      .then((response) => {
        getData(response.Items);
      });
  };
  const call = () =>{
    fetch("https://8in207fxt2.execute-api.us-east-1.amazonaws.com/dev/toggle", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        "oCode":org
      }),
    })
    .then(
      (res) => {
        if(res.ok){
            res.json().then((response) => {
                
                
            })
            toast("Status toggled")
        }else{
            toast("Request failed, please try again")
        }
    }
    )
  }
  
  const ShowOrganization = () =>{
    return (
      record.map(({ org,pustr,orgstatus }, i) => (
        <div key={i} className="orgItem">
            {i === 0 ? null : ''}
            <TextField
              label="Organization Code"
              value={org}
              onClick={(e)=>{setOrg(e.target.value)}}
            />
            <TextField
              label="Status"
              value={orgstatus}
            />

        </div>
    ))
    )
  }


  return (
    <>
      <div className="orgContainer">
        <ShowOrganization/>
        <div className="desc-m">
          Selected Organization:
        </div>
        <div className="desc-l">
          {org}
        </div>
      </div>
      <div className="btn-upload">
                <Fab
                  style={{
                    position: "absolute",
                    background: "#ffdbcc",
                    color: "#d11f00",
                  }}
                >
                  <PublishIcon
                    type="button"
                    onClick={() => {
                      org !== ""
                      ?call()
                      :toast("Please select an organization.")
                    }}
                  ></PublishIcon>
                </Fab>
              </div>
      <ToastContainer />
    </>
  );
}

export default Manage;
