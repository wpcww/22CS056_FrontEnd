import React, { useRef, useState } from "react";
import "./Create.css";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Create() {
  const [name, setName] = useState("")

  const [struct, setStruct] = useState(
    {
      "0":{
      "Predecessor":null,
      "Successor":[]
      }
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

  const data = useRef(
    {
      "0":["",""]
    }
  )

  const output = useRef(
    {
      "Name":"",
      "Requirement":[]
    }
  )

  const build = () => {
    output.current.Name = name
    output.current.Requirement = struct
    Object.keys(struct).forEach((item) => {
      if(item !== "0"){
        output.current.Requirement[item].Value = data.current[item]
        //console.log(output.current.Requirement[item])
      }
    })
    toast("Updated!")
  }

  const commit = () => {
    const temp = JSON.parse(JSON.stringify(structClone.current))
    setStruct(temp)
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
    var rIndex = struct[struct[index].Predecessor].Successor.indexOf(index)
      if (rIndex !== 1){
        structClone.current[struct[index].Predecessor].Successor.splice(rIndex, 1)
      }
  }

  const handleRemove = (index) => {
    if(struct[index].Successor.length === 0){
      delete structClone.current[index]
    }else{
      struct[index].Successor.forEach((item) => {
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
    //console.log(index)
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
    // console.log(index)
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
          //value={data[index][0]}
          onChange={(e) => handleChangeInput(index, 0, e)}
          />
          <RemoveIcon onClick={() => {
            handleRemovePred(index)
            handleRemove(index)
            const temp = JSON.parse(JSON.stringify(structClone.current))
            setStruct(temp)
            
          }}></RemoveIcon>
        </div>
        <div className="newBranch">
        {
          //Recursion
          struct[index].Successor.map(item =>{
              if (struct[item].Predecessor === index && struct[item].Successor.length === 0){
                return(<DisplaySingle objKey={item} key={item + "DS"}/>)
              }else if(struct[item].Successor.length !== 0 && item !== "0"){
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
    React.Children.toArray(Object.keys(struct).forEach(item => {
    //console.log(struct[item])
      if(struct[item].Predecessor === "0" && struct[item].Successor.length === 0){
        displayList.push(
          <div key={item + "DS"}>
            <div>====== Main Requirement ======</div>
            <DisplaySingle objKey={item}/>
          </div>
        )
      }else if(struct[item].Successor.length !== 0 && item !== "0" && struct[item].Predecessor === "0"){
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
        <div>Project Name: {name}</div>
        <div>Data: {JSON.stringify(data.current)}</div>
        {/* <div>Current json: {JSON.stringify(struct)}</div>
        <div>Clone json: {JSON.stringify(structClone.current)}</div> */}
        <div>Output: {JSON.stringify(output.current)}</div>
        <div>Sync status: {(JSON.stringify(structClone.current) === JSON.stringify(struct)).toString()}</div>
      </>
    )
  }

  const post = () => {
    fetch('https://5msl1adfyb.execute-api.ap-east-1.amazonaws.com/test/create', {
    method: 'POST',
    body: JSON.stringify(output.current)
  });
  }

  // const read = (json) => {
  //   setName(json.Name);
  //   setStruct(json.Requirement);
  //   structClone.current = json.Requirement;
  //   Object.keys(json.Requirement).forEach((item) => {
  //     data.current[item] = json.Requirement[item]

  //   })

  // }

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
                    //value={struct.Name || ''}
                    onChange={(e) => setName(e.target.value)}
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