import React, { useState, useRef } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import PublishIcon from "@mui/icons-material/Publish";
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';
import "./Collapsible.css";

function Collapsible({orgRef}) {
  const [record, getData] = useState({
    info:{},
    sign:""
  });
  const vr = useRef("")
  const [vrState, setVr] = useState("")
  const vid = useRef("")
  const [vidState, setVid] = useState("")
  const ver = useRef(false)
  const [verState, setVer] = useState(false)
  const URL = "https://7li91t4asl.execute-api.us-east-1.amazonaws.com/development/authenticate";
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      "org": orgRef.oCode,
      "vr": vrState,
      "vid": vidState
    })
  }

  const fetchData = () => {
    fetch(URL, requestOptions)
      .then((res) => res.json())

      .then((response) => {
        getData(response);
        ver.current = verifyfn(record.info, record.sign, orgRef.pkstr)
        setVer(ver.current)
      });
  };

  const DisplayMultiple = (props) => {
    const index = props.objKey;
    const data = props.content;
    return (
      <>
        <ListItem>
          <ListItemIcon>
            <Checkbox />
          </ListItemIcon>
          <ListItemText primary={data[index].Value[0]} />
        </ListItem>

        <div className="newBranch" style={{ marginLeft: "36px" }}>
          {data[index].Successor.map((item) => {
            if (
              data[item].Predecessor === index &&
              data[item].Successor.length === 0
            ) {
              return (
                <DisplaySingle objKey={item} content={data} key={item + "DS"} />
              );
            } else if (data[item].Successor.length !== 0 && item !== "0") {
              return (
                <DisplayMultiple
                  objKey={item}
                  content={data}
                  key={item + "DM"}
                />
              );
            }
            return null;
          })}
        </div>
      </>
    );
  };

  const DisplaySingle = (props) => {
    const index = props.objKey;
    const data = props.content;
    return (
      <>
        <div className="reqDiv">
          <ListItem>
            <ListItemIcon>
              <Checkbox />
            </ListItemIcon>
            {data[index].Value[1] !== "" ? (
              <a href={"//" + data[index].Value[1]}>
                <ListItemText
                  primary={data[index].Value[0]}
                  secondary={data[index].Value[1]}
                />
              </a>
            ) : (
              <ListItemText
                primary={data[index].Value[0]}
                secondary={data[index].Value[1]}
              />
            )}
          </ListItem>
        </div>
      </>
    );
  };

  const RequirementDisplay = (props) => {
    var reqJson = props.reqJson;
    var displayList = [];
    Object.keys(reqJson).map((item) => {
      if (
        reqJson[item].Predecessor === "0" &&
        reqJson[item].Successor.length === 0
      ) {
        displayList.push(
          <div key={item + "DS"}>
            <DisplaySingle objKey={item} content={reqJson} />
          </div>
        );
      } else if (
        reqJson[item].Successor.length !== 0 &&
        item !== "0" &&
        reqJson[item].Predecessor === "0"
      ) {
        displayList.push(
          <div key={item + "DM"}>
            <DisplayMultiple objKey={item} content={reqJson} />
          </div>
        );
      }
      return null;
    });
    return displayList;
  };

  return (
    <>
      <div>Organization Code: {orgRef.oCode}</div>
      <div>Organization Public Key: {orgRef.pkstr}</div>
      <Paper className="prefHolder" elevation={8}>
        <div className="flex-container">
          <div style={{marginRight:"10px"}}>
            <TextField
                          required
                          error={vr.current === ""}
                          name="vr"
                          label="Identity Document"
                          variant="filled"
                          onChange={(e) => {vr.current = e.target.value}}
                          onPaste={(e) => {vr.current = e.clipboardData.getData('text')
                          setVr(vr.current)
                          console.log("Vr: " + vr.current)
                        }}
            />
          </div>
          <div style={{marginLeft:"10px"}}>
            <TextField
                          required
                          error={vid.current === ""}
                          name="vid"
                          label="Vaccination ID"
                          variant="filled"
                          onChange={(e) => {
                              vid.current = e.target.value
                          }}
                          onPaste={(e) => {
                            vid.current = e.clipboardData.getData('text')
                            setVid(vid.current)
                            console.log("Vid: " + vid.current)
                          }
                          }
            />
          </div>
        </div>
        {/* <div className="preferences">record</div> */}
        {
          verState
          ?<RequirementDisplay reqJson={record.info}/>
          :<RequirementDisplay reqJson={record.info}/>
        }
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
                      fetchData();
                    }}
                  ></PublishIcon>
                </Fab>
              </div>
      </Paper>
    </>
    
  );
}

function verifyfn(message, signature, pkstr){
  console.log("Message: " + JSON.stringify(message))
  console.log("Signature: " + signature)
  console.log("Public Key: " + pkstr)
  var verifyCom = new JSEncrypt();
  verifyCom.setPublicKey(pkstr);
  var verified = verifyCom.verify(JSON.stringify(message), signature, CryptoJS.SHA256);
  console.log("Verify result: " + verified)
  return verified
}


export default Collapsible;
