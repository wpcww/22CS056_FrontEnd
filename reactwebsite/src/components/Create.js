import React, { useRef } from "react";
import "./Create.css";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Create({state, setState, structClone, data}) {

  const output = useRef(
    {
      "Name":"",
      "Requirement":[]
    }
  )

  const build = () => {
    output.current.Name = state.nameField
    output.current.Requirement = state.structField
    Object.keys(state.structField).forEach((item) => {
      if(item !== "0"){
        output.current.Requirement[item].Value = data.current[item]
        //console.log(output.current.Requirement[item])
      }
    })
    toast("Updated!")
  }

  const commit = () => {
    const temp = JSON.parse(JSON.stringify(structClone.current))
    //setStruct(temp)
    setState({...state, structField: temp})
  }

  function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
        return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
    });
  }

  const handleChangeInput = (recKey, valueIndex, event) => {
    data.current[recKey][valueIndex] = event.target.value
  }

  const handleAddReq = (Predecessor) => {
    //Add new key value pair
    var newRecord = _uuid().toString()
    structClone.current[newRecord] = {
      "Predecessor":Predecessor,
      "Successor":[],
      "Value":["",""]
    }
    //Update Predecessor's successor
    structClone.current[Predecessor].Successor.push(newRecord)
    //data part
    data.current[newRecord] = ["",""]
    commit()
  }

  const handleRemovePred = (index) => {
    var rIndex = state.structField[state.structField[index].Predecessor].Successor.indexOf(index)
      if (rIndex !== 1){
        structClone.current[state.structField[index].Predecessor].Successor.splice(rIndex, 1)
      }
  }

  const handleRemove = (index) => {
    if(state.structField[index].Successor.length === 0){
      delete structClone.current[index]
    }else{
      state.structField[index].Successor.forEach((item) => {
        handleRemove(item)
        delete structClone.current[index]
      })
    }
  }

  const handleSingle = (index) =>{
    //Remove all Successor
    structClone.current[index].Successor.forEach((item, i) => {
      handleRemovePred(item)
      handleRemove(item)
    })
  }

  const handleMulti = (index) =>{
    //Remove all Successor
    structClone.current[index].Successor.forEach((item) => {
      handleRemovePred(item)
      handleRemove(item)
    })
    //Change type by adding children, using index as predecessor
    handleAddReq(index)
  }

  const DisplaySingle = (props) => {
    const index = props.objKey
    //console.log(data.current[index][0])
    return (
      <div key={index}>
        <div>
          <Button key={index + "Multi"} onClick={() => {
              handleMulti(index)
              commit()
            }}>
            Multiple
          </Button>
        </div>
        <div>
          <TextField key={index + "DESC"}
          name="rText"
          label="Requirement"
          variant="filled"
          defaultValue={data.current[index][0]}
          //value={data.current[index][0]}
          onChange={(e) => handleChangeInput(index, 0, e)}
          />
          <TextField key={index + "URL"}
          name="URL"
          label="URL (Optional)"
          variant="filled"
          defaultValue={data.current[index][1]}
          //value={data.index[1]}
          onChange={(e) => handleChangeInput(index, 1, e)}
          />
          <RemoveIcon onClick={() => 
            {
              handleRemovePred(index)
              handleRemove(index)
              commit()
            }}></RemoveIcon>
        </div>
      </div>
    )
  }

  const DisplayMultiple = (props) => {
    const index = props.objKey
    //console.log(index)
    return(
      <>
        <div>
        <Button key={index + "Single"} onClick={() => {
              handleSingle(index)
              commit()
            }}>
            Single
          </Button>
        </div>
        <div>
          <TextField key={index + "Branch"}
          name={"cataName" + index}
          label="Requirement"
          variant="filled"
          defaultValue={data.current[index][0]}
          onChange={(e) => handleChangeInput(index, 0, e)}
          />
          <RemoveIcon onClick={() => {
            handleRemovePred(index)
            handleRemove(index)
            const temp = JSON.parse(JSON.stringify(structClone.current))
            //setStruct(temp)
            setState({...state, structField: temp})
            
          }}></RemoveIcon>
        </div>
        <div className="newBranch">
        {
          //Recursion
          state.structField[index].Successor.map(item =>{
              if (state.structField[item].Predecessor === index && state.structField[item].Successor.length === 0){
                return(<DisplaySingle objKey={item} key={item + "DS"}/>)
              }else if(state.structField[item].Successor.length !== 0 && item !== "0"){
                return(<DisplayMultiple objKey={item} key={item + "DM"}/>)
              }
              return null
          })
        }
        <div>
          <button type="button" className="btn btn-primary mt-2" onClick={() => handleAddReq(index)}>
            Add Requirement
          </button>
        </div>
        </div>
      </>
    )
  }

  const RequirementDisplay = () => {
    var displayList = []
    React.Children.toArray(Object.keys(state.structField).forEach(item => {
    //console.log(struct[item])
      if(state.structField[item].Predecessor === "0" && state.structField[item].Successor.length === 0){
        displayList.push(
          <div key={item + "DS"}>
            <div>====== Main Requirement ======</div>
            <DisplaySingle objKey={item}/>
          </div>
        )
      }else if(state.structField[item].Successor.length !== 0 && item !== "0" && state.structField[item].Predecessor === "0"){
        displayList.push(
          <div key={item + "DM"}>
            <div>====== Main Requirement ======</div>
            <DisplayMultiple objKey={item} />
          </div>
        )
      }
    }
    ))
    return displayList
  }

  const DebugArea = () => {
    return (
      <>
        <div>=====================DEBUG=====================</div>
        <div>Project Name: {state.nameField}</div>
        <div>Data: {JSON.stringify(data.current)}</div>
        <div>JSON: {JSON.stringify(state.structField)}</div>
        {/* <div>Current json: {JSON.stringify(struct)}</div> */}
        <div>Clone json: {JSON.stringify(structClone.current)}</div>
        <div>Output: {JSON.stringify(output.current)}</div>
        <div>Sync status: {(JSON.stringify(structClone.current) === JSON.stringify(state.structField)).toString()}</div>
        <div>=====================DEBUG=====================</div>
      </>
    )
  }

  const post = () => {
    fetch('https://5msl1adfyb.execute-api.ap-east-1.amazonaws.com/test/create', {
    method: 'POST',
    body: JSON.stringify(output.current)
  });
  }

  return(
    <>
      <div>Create template</div>
        <Container>
          <form>
              <>
                <div>
                  <TextField
                    name="pName"
                    label="Project Name"
                    variant="filled"
                    value={state.nameField}
                    onChange={(e) => {
                      setState({nameField: e.target.value})
                    }}
                  />
                </div>
                <RequirementDisplay/>
                <div>
                  <button type="button" className="btn btn-primary mt-2" onClick={() => handleAddReq("0")}>
                      Add Requirement
                  </button>
                </div>
                <button type="button" onClick={() => {build(); commit(); post()}}>Update</button>
              </>
          </form> 
        </Container>
        <DebugArea/>
        <ToastContainer />
    </>
  )
}

export default Create;