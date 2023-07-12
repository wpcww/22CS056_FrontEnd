import React, { useState, useRef, useEffect} from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import PublishIcon from "@mui/icons-material/Publish";
import { ToastContainer, toast } from "react-toastify";
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';
import "./Collapsible.css";
import { Html5QrcodeScanner } from "html5-qrcode";

function Collapsible({orgRef}) {
  const vr = useRef("")
  const [vrState, setVr] = useState("")
  const vid = useRef("")
  const [vidState, setVid] = useState("")
  const ver = useRef(false)
  const [verState, setVer] = useState(false)
  const URL = "https://8in207fxt2.execute-api.us-east-1.amazonaws.com/dev/authenticate";
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
  // QR Code scanner setup
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        qrbox:{
          width: 250,
          height: 250
        },
        fps:5
      }
    );
    scanner.render(success,error)
    function success(result){
      scanner.clear()
      const resJson = JSON.parse(result.toString("utf8"))
      vr.current = resJson.vr
      setVr(resJson.vr)
      vid.current = resJson.vid
      setVid(resJson.vid)
    }
    function error(err){
      // console.log("Scan error: " + err)
    }
  },[vrState,vidState])

  const [record, getData] = useState({
    info:{},
    sign:""
  });

  const fetchData = () => {
    console.log("Vr: " + vrState)
    console.log("Vid: " + vidState)
    fetch(URL, requestOptions)
      
    .then((res) => {
      if (res.ok){
        res.json().then((response) => {
          getData({info:JSON.parse(response.info), sign:response.sign});
          var result = verifyfn(response.info, response.sign, orgRef.pkstr)
          ver.current = result
          result === false
          ? toast("Organization Mismatch.")
          : setVer(result)
        })
      }else{
        toast("Request failed, please Retry")
      }
    })
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
      {/* <div>Organization Public Key: {orgRef.pkstr}</div> */}
      <Paper className="prefHolder" elevation={8}>
        <div>Organization Code: {orgRef.oCode}</div>
        <div className="flex-container">
          <div style={{marginRight:"10px"}}>
            <TextField
                          required
                          error={vr.current === ""}
                          name="vr"
                          label="Identity Document"
                          value={vr.current}
                          variant="filled"
                          onChange={(e) => {vr.current = e.target.value}}
                          onPaste={(e) => {vr.current = e.clipboardData.getData('text')
                          setVr(vr.current)
                          // console.log("Vr: " + vr.current)
                        }}
            />
          </div>
          <div style={{marginLeft:"10px"}}>
            <TextField
                          required
                          error={vid.current === ""}
                          name="vid"
                          label="Vaccination ID"
                          value={vid.current}
                          variant="filled"
                          onChange={(e) => {
                              vid.current = e.target.value
                          }}
                          onPaste={(e) => {
                            vid.current = e.clipboardData.getData('text')
                            setVid(vid.current)
                            // console.log("Vid: " + vid.current)
                          }
                          }
            />
          </div>
        </div>
        {
          verState
          ?<RequirementDisplay reqJson={record.info}/>
          :<></>
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
      {verState === false
      ?<div className="readContainer">
        <div id='reader'></div>
      </div>
      :<div></div>
      }
      <ToastContainer />
    </>
    
  );
}

function verifyfn(message, signature, pkstr){
  // console.log("Message: " + message)
  // console.log("Signature: " + signature)
  // console.log("Public Key: " + pkstr)
  var verifyCom = new JSEncrypt();
  verifyCom.setPublicKey(pkstr);
  var verified = verifyCom.verify(message, signature, CryptoJS.SHA256);
  console.log("Verify result: " + verified)
  return verified
}


export default Collapsible;
