import React, { useEffect, useState } from "react";
import { useRef } from 'react';
import "./Create.css";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, ThemeProvider } from "@mui/material";

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

  const data = useRef(
    {
      "0":["",""]
    }
  )

  const remQueue = useRef([])

  function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  const handleChangeInput = (recKey, valueIndex, event) => {
    data.current[recKey][valueIndex] = event.target.value
  }

  const handleAddReq = (Predecessor) => {
    const temp = JSON.parse(JSON.stringify(struct));
    //Case layer 0
    
      //Add new key value pair
      var newRecord = _uuid().toString()
      temp[newRecord] = {
        "Predecessor":Predecessor,
        "Successor":[],
        "Value":["",""]
      }
      //Update Predecessor's successor
      temp[Predecessor].Successor.push(newRecord)

      //data part
      data.current[newRecord] = ["",""]
    //Case branch
    setStruct(temp);
  }

  const getChildList = (index, json) => {
    console.log(json[index].Successor)
    if(json[index].Successor.length === 0){
      remQueue.current.push(index)
    }else{
      Object.keys(json[index]).map((item) => {
        delete json[index]
        getChildList(item, json)
      })
    }
  }

  const handleRemove = (index) => {
    const temp = JSON.parse(JSON.stringify(struct))
    if(struct[index].Successor.length === 0){
      remQueue.current.push(index)
    }else{
      struct[index].Successor.map((item) => {
        remQueue.current.push(index)
        handleRemove(item)
      })
    }
  }

  const handlePredClear = (index) => {
    const temp = JSON.parse(JSON.stringify(struct))
    //Remove predecessor's successor
    for (let i = 0; i < temp[temp[index].Predecessor].Successor.length; i++){
      if(temp[temp[index].Predecessor].Successor[i] === index){
        temp[temp[index].Predecessor].Successor.splice(i, 1)
      }
    }
  }

  const handleRQ = () => {
    remQueue.current.map((item) => {
      const temp = JSON.parse(JSON.stringify(struct))
      delete temp[item]
      setStruct(temp)
    })
  }

  const handleSingle = (index) =>{
    const temp = JSON.parse(JSON.stringify(struct))
    //Remove all Successor
    temp[index].Successor.map((item) => {
      return delete temp[item]
    })
    console.log(temp)
    //
    setStruct(temp)
  }

  const handleMulti = (index) =>{
    const temp = JSON.parse(JSON.stringify(struct))
    //Remove all Successor
    temp[index].Successor.map((item) => {
      return handleRemove(item)
    })
    //Change type by adding children, using index as predecessor
    handleAddReq(index)
  }

  const DisplaySingle = (props) => {
    var index = props.objKey
    //console.log(data.current)
    return (
      <>
        <div>
          <Button key="Single" onClick={() => handleSingle(index)}>
            Single
          </Button>
          <Button key="Multi" onClick={() => handleMulti(index)}>
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
          <RemoveIcon onClick={(index) => 
            {
              handlePredClear(index)
              handleRemove(index)
              handleRQ()
              remQueue.current = []
            }}></RemoveIcon>
        </div>
      </>
    )
  }

  const DisplayMultiple = (props) => {
    const index = props.objKey
    return(
      <>
        <div>
          <Button key="Single" onClick={() => handleSingle(index)}>
            Single
          </Button>
          <Button key="Multi" onClick={() => handleMulti(index)}>
            Multiple
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
            handlePredClear(index)
            handleRemove(index)
            handleRQ()
            remQueue.current = []
          }}></RemoveIcon>
        </div>
        {
          //Recursion
          struct[index].Successor.map(item =>{
            //console.log(struct[item].Predecessor)
              if (struct[item].Predecessor === index && struct[item].Successor.length === 0){
                //console.log("Index: " + index + " Item: " + item)
                return(<DisplaySingle objKey={item}/>)
              }else if(struct[item].Successor.length !== 0 && item !== "0"){
                console.log("Multi")
                return(<DisplayMultiple/>)
              }
              return null
              
              
          })
          
          
        }
        <div>
          <button type="button" className="btn btn-primary mt-2" onClick={() => handleAddReq(index)}>
            Add Requirement
          </button>
        </div>


      </>
    )
  }

  const RequirementDisplay = () => {
    //console.log()
    var displayList = []

    Object.keys(struct).map(itemKey => {
    let obj = struct[itemKey]
      if(obj.Predecessor === "0" && obj.Successor.length === 0){
        displayList.push(
          <>
            <div>====== Main Requirement ======</div>
            <DisplaySingle objKey={itemKey}/>
          </>
        )
      }else if(obj.Successor.length !== 0 && itemKey !== "0"){
        displayList.push(
          <>
            <div>====== Main Requirement ======</div>
            <DisplayMultiple objKey={itemKey}/>
          </>
        )
      }
      return null
    }
    )
    return displayList
  }

  
  return(
    <>
        <div>Create template</div>
        <div>Project Name: {name}</div>
        <div>Current json: {JSON.stringify(struct)}</div>
        <div>Queue: {JSON.stringify(remQueue)}
        <Button type="button" onClick={()=>{
          remQueue.current=[]
          getChildList("0",struct)
        }
          } 
          >Update</Button>
        </div>
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
                <button type="submit">Submit Here</button>
              </>
          </form> 
        </Container>
    </>
  )
}

export default Create;