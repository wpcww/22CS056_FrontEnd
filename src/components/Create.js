import React, { useRef, useEffect, useState } from "react";
import "./Create.css";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Button, Paper } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import PublishIcon from "@mui/icons-material/Publish";
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';
import QRCode from 'react-qr-code';


function Create({ state, setState, structClone, data, orgRef }) {
  //QR code generate setup
  const [value, setValue] = useState();
  const back = '#FFFFFF';
  const fore = '#000000';
  const size = 256;

  const output = useRef({
    vr: "",
    org: "",
    info: [],
  });
  const prstr = useRef("")
  const [prState, setPr] = useState("")

  const build = () => {
    output.current.vr = state.nameField;
    output.current.info = state.structField;
    output.current.org = orgRef.oCode;
    Object.keys(state.structField).forEach((item) => {
      if (item !== "0") {
        output.current.info[item].Value = data.current[item];
      }
    });
    toast("Updated!");
  };

  //Rerender with the all the changes done to the structure and data
  const commit = () => {
    const temp = JSON.parse(JSON.stringify(structClone.current));
    setState({ ...state, structField: temp });
  };

  function _uuid() {
    var d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  const handleChangeInput = (recKey, valueIndex, event) => {
    data.current[recKey][valueIndex] = event.target.value;
  };

  const handleAddReq = (Predecessor) => {
    //Add new key value pair
    var newRecord = _uuid().toString();
    structClone.current[newRecord] = {
      Predecessor: Predecessor,
      Successor: [],
      Value: ["", ""],
    };
    //Update Predecessor's successor
    structClone.current[Predecessor].Successor.push(newRecord);
    //data part
    data.current[newRecord] = ["", ""];
    commit();
  };

  const handleRemovePred = (index) => {
    var rIndex =
      state.structField[state.structField[index].Predecessor].Successor.indexOf(
        index
      );
    structClone.current[state.structField[index].Predecessor].Successor.splice(
      rIndex,
      1
    );
  };

  //Remove the selected recored, and also its children if exists
  const handleRemove = (index) => {
    if (state.structField[index].Successor.length === 0) {
      delete structClone.current[index];
    } else {
      state.structField[index].Successor.forEach((item) => {
        handleRemove(item);
        delete structClone.current[index];
      });
    }
  };

  //Multiple type to Single type
  const handleSingle = (index) => {
    //Remove all Successor
    structClone.current[index].Successor.forEach((item) => {
      handleRemovePred(item);
      handleRemove(item);
    });
  };

  //Single to type to Multiple type
  const handleMulti = (index) => {
    //Remove all Successor
    structClone.current[index].Successor.forEach((item) => {
      handleRemovePred(item);
      handleRemove(item);
    });
    //Change type by adding children, using index as predecessor
    handleAddReq(index);
  };

  const DisplaySingle = (props) => {
    const index = props.objKey;
    return (
      <>
        <div key={index}>
          <div>
            <Button
              key={index + "Multi"}
              onClick={() => {
                handleMulti(index);
                commit();
              }}
            >
              Multiple
            </Button>
          </div>
          <div>
            <TextField
              key={index + "DESC"}
              style={{ marginLeft: "5px" }}
              required
              name="rText"
              label="Field Name"
              variant="filled"
              defaultValue={data.current[index][0]}
              onChange={(e) => handleChangeInput(index, 0, e)}
            />
            <TextField
              key={index + "URL"}
              style={{ marginLeft: "5px" }}
              name="URL"
              label="Field Value"
              variant="filled"
              defaultValue={data.current[index][1]}
              onChange={(e) => handleChangeInput(index, 1, e)}
            />
            <RemoveIcon
              style={{ color: "red" }}
              onClick={() => {
                handleRemovePred(index);
                handleRemove(index);
                commit();
              }}
            ></RemoveIcon>
          </div>
        </div>
      </>
    );
  };

  const DisplayMultiple = (props) => {
    const index = props.objKey;
    return (
      <>
        <div>
          <Button
            key={index + "Single"}
            onClick={() => {
              handleSingle(index);
              commit();
            }}
          >
            Single
          </Button>
        </div>
        <div>
          <TextField
            key={index + "Branch"}
            style={{ marginLeft: "5px" }}
            name={"cataName" + index}
            label="Field Name"
            variant="filled"
            defaultValue={data.current[index][0]}
            onChange={(e) => handleChangeInput(index, 0, e)}
          />
          <RemoveIcon
            style={{ color: "red" }}
            onClick={() => {
              handleRemovePred(index);
              handleRemove(index);
              const temp = JSON.parse(JSON.stringify(structClone.current));
              setState({ ...state, structField: temp });
            }}
          ></RemoveIcon>
        </div>
        <div className="divBranch">
          {
            //Recursion
            state.structField[index].Successor.map((item) => {
              if (
                state.structField[item].Predecessor === index &&
                state.structField[item].Successor.length === 0
              ) {
                return <DisplaySingle objKey={item} key={item + "DS"} />;
              } else if (
                state.structField[item].Successor.length !== 0 &&
                item !== "0"
              ) {
                return <DisplayMultiple objKey={item} key={item + "DM"} />;
              }
              return null;
            })
          }
          <div>
            <AddIcon
              style={{ color: "#32CD32" }}
              onClick={() => handleAddReq(index)}
            ></AddIcon>
          </div>
        </div>
      </>
    );
  };

  const RequirementDisplay = () => {
    var displayList = [];
    Object.keys(state.structField).forEach((item) => {
      if (
        state.structField[item].Predecessor === "0" &&
        state.structField[item].Successor.length === 0
      ) {
        displayList.push(
          <Paper
            elevation={8}
            className="paper"
            key={item + "DS"}
            style={{ paddingBottom: "5px" }}
          >
            <div>
              <Divider variant="middle">Single Field</Divider>
            </div>
            <DisplaySingle objKey={item} />
          </Paper>
        );
      } else if (
        state.structField[item].Successor.length !== 0 &&
        item !== "0" &&
        state.structField[item].Predecessor === "0"
      ) {
        displayList.push(
          <Paper elevation={8} className="paper" key={item + "DM"}>
            <div>
              <Divider variant="middle">Nested Field</Divider>
            </div>
            <DisplayMultiple objKey={item} />
          </Paper>
        );
      }
    });
    return displayList;
  };

    // const DebugArea = () => {
    //   return (
    //     <>
    //       <div>=====================DEBUG=====================</div>
    //       <div>Project Name: {state.nameField}</div>
    //       <div>Data: {JSON.stringify(data.current)}</div>
    //       <div>JSON: {JSON.stringify(state.structField)}</div>
    //       {/* <div>Current json: {JSON.stringify(struct)}</div> */}
    //       <div>Clone json: {JSON.stringify(structClone.current)}</div>
    //       <div>Output: {JSON.stringify(output.current)}</div>
    //       <div>
    //         Sync status:{" "}
    //         {(
    //           JSON.stringify(structClone.current) ===
    //           JSON.stringify(state.structField)
    //         ).toString()}
    //       </div>
    //       <div>=====================DEBUG=====================</div>
    //     </>
    //   );
    // };

  const post = () => {
    // Generate signature of info
    var encryptCom = new JSEncrypt();
    encryptCom.setPrivateKey(prState)
    var signature = encryptCom.sign((JSON.stringify(output.current.info)), CryptoJS.SHA256, "sha256");
    // Local signature verification test
    encryptCom.setPublicKey(orgRef.pkstr);
    var res = encryptCom.verify(JSON.stringify(output.current.info), signature, CryptoJS.SHA256);
    console.log("self verify: " + res)

    // POST request to DDB
    fetch("https://7li91t4asl.execute-api.us-east-1.amazonaws.com/development/create", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        vr:output.current.vr,
        org:output.current.org,
        info:JSON.stringify(output.current.info),
        sign:signature
      }),
    })
    .then(
      (res) => {
        if(res.ok){
            res.json().then((response) => {
                setValue(
                  JSON.stringify(
                  {
                    org:output.current.org,
                    vr:output.current.vr,
                    vid:response
                  }
                  )
                )
            })
            toast("Organization confirmed.")
        }else{
            toast("Invalid organization Code, please try again.")
        }
    }
    )
  };

  const clear = () => {
    setState({
      ...state,
      nameField: "",
      structField: {
        0: {
          Predecessor: null,
          Successor: [],
        },
      },
    });
    data.current = {
      0: ["", ""],
    };
    structClone.current = {
      0: {
        Predecessor: null,
        Successor: [],
      },
    };
    output.current = {
      org: orgRef.oCode,
      vr: "",
      info: [],
    };
  };

  // Reset structure and data when navigating between pages, or at the first render
  useEffect(() => {
    clear();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Container>
        <form>
          <>
            <div style={{ marginTop: "10px" }}>
              <TextField
                required
                error={state.nameField === ""}
                name="pName"
                label="Identity Number"
                variant="filled"
                value={state.nameField || ""}
                onChange={(e) => {
                  setState({
                    ...state,
                    nameField: e.target.value,
                  });
                }}
              />
              <TextField
                required
                error={prstr.current === ""}
                name="prstr"
                label="Private Key"
                variant="filled"
                onChange={(e) => {
                  prstr.current = e.target.value
                }}
                onPaste={(e) => {
                  prstr.current = e.clipboardData.getData('text')
                  setPr(prstr.current)
                }
                }
                
              />
              <Button
                type="button"
                className="btn-clear"
                onClick={() => clear()}
              >
                Clear
              </Button>
            </div>
            <RequirementDisplay />
            <div>
              <AddIcon
                style={{ color: "#32CD32" }}
                onClick={() => handleAddReq("0")}
              ></AddIcon>
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
                    build();
                    commit();
                    post();
                  }}
                ></PublishIcon>
              </Fab>
            </div>
          </>
        </form>
      </Container>
      {value && (
                    <QRCode
                        title="GeeksForGeeks"
                        value={value}
                        bgColor={back}
                        fgColor={fore}
                        size={size === '' ? 0 : size}
                    />
                )}
      {/* {<DebugArea />} */}
      <ToastContainer />
    </>
  );
}

export default Create;
