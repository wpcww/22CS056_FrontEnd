import React, { useRef } from "react";
import "./Organization.css"
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import PublishIcon from "@mui/icons-material/Publish";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fab from "@mui/material/Fab";

function Organization({ orgRef, setOrg }){
    const orgTemp = useRef("")
    const retrieve = () => {
        fetch("https://8in207fxt2.execute-api.us-east-1.amazonaws.com/dev/retrieve", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({"oCode":orgTemp.current}),
          })
        .then(
            (res) => {
                if(res.ok){
                    res.json().then((response) => {
                        setOrg({...orgRef, oCode:orgTemp.current, pkstr:response})
                    })
                    toast("Organization confirmed.")
                }else{
                    toast("Invalid organization Code, please try again.")
                }
            }
        )

    }

    return (<>
        <Container>
            <form>
            <div className="tfHolder">
                <TextField
                    required
                    error={orgTemp.current === ""}
                    name="oCode"
                    label="Organization Code"
                    variant="filled"
                    onSubmit={(e) => e.preventDefault()}
                    onChange={(e) => {
                        orgTemp.current = e.target.value
                        /////Debug in Console
                        // console.log("Value of orgTemp: " + orgTemp.current)
                        // console.log("Value of oCode: " + orgRef.oCode)
                        // console.log("Value of pkstr: " + orgRef.pkstr)
                    }}
                />
            </div>
            </form>
            <div className="desc-s">
                Please input the Organization's code for any further operation.
            </div>
            <div className="desc-s">
                Organization-in-use can be changed by re-submitting. 
            </div>
            <div className="desc-m">
                Current organization:
            </div>
            <div className="desc-l">
                {
                   orgRef.pkstr==="" || orgRef.pkstr===undefined
                   ?<div>Not Set</div>
                   :<div>{orgRef.oCode}</div>
                }
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
                    retrieve()
                  }}
                ></PublishIcon>
              </Fab>
            </div>
        </Container>
        <ToastContainer />
    </>)
}

export default Organization;