import React, { useState } from "react";
import "./Create.css";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button } from "@mui/material";

function Create() {
  const [input, setInput] = useState(
    {
      "Name":"",
      "Requirement":
      [
          {
              "Type":"Single",
              "Value":["",""]
          }
      ]
   },
  )

  const handleChangeInput = (recKey, event) => {
    const temp = JSON.parse(JSON.stringify(input));
    temp["Name"]=event.target.value
    setInput(temp);
  }

  const handleChangeRequirement = (prev, iKey, recKey, event) => {
    const temp = JSON.parse(JSON.stringify(input));
    temp[prev][iKey]["Value"][recKey]=event.target.value
    setInput(temp);
  }

  const handleAddReq = () => {
    const temp = JSON.parse(JSON.stringify(input));
    temp["Requirement"].push({"Type":"Single","Value":["",""]})
    setInput(temp);
  }

  const handleRemoveField = (id) => {
    const temp = JSON.parse(JSON.stringify(input));
    temp["Requirement"].splice(id,1)
    setInput(temp)
  }

  const toggleType = (prev, iKey, typeString) => {
    const temp = JSON.parse(JSON.stringify(input));
    temp.prev.iKey.Type=typeString;
    temp.prev.iKey.Branch=[{"":""}];
    setInput(temp) 
  }

  const pathMaker = (prev) => {
    var layer = {}
    layer.each(function(){
      layer[this.id] = (this).val();
    })
    return JSON.stringify(layer)
  }

  const typeBranching = (prev,json,iKey) =>{
    if (json["Type"] === "Single"){
      return(
        <>
        <div>Requirement {iKey}</div>
        <div>
          <Button onClick={() => toggleType(prev,iKey,"Single")}>Single
          </Button>
          <Button onClick={() => toggleType(prev,iKey,"Option")}>Option
          </Button>
        </div>
        <div key={iKey.toString()}>
          <TextField
            name="Requirement"
            label="Requirement Item"
            variant="filled"
            value={json["Value"][0]}
            onChange={event => handleChangeRequirement(prev, iKey, 0, event)}
          />
          <TextField
            name="Requirement"
            label="URL(Optional)"
            variant="filled"
            value={json["Value"][1]}
            onChange={event => handleChangeRequirement(prev, iKey, 1, event)}
          />
          <RemoveIcon type="button" onClick={() => handleRemoveField(iKey)} />
          </div>
      </>
      )

    }else{
      return(
        <>
          <div>
            Available choices:
            <TextField
            name="Requirement"
            label="Branch Name"
            variant="filled"
            value={json["Value"][0]}
            //onChange={event => handleChangeRequirement(iKey, 1, event)}
            />
            {
              json.Branch.map((item,index) => {
                prev = prev.Branch
                return(typeBranching(prev,item,index))
              })
            }
          </div>
          <div>

          </div>
        </>
      )
    }
  }

  const reqTemplate = input["Requirement"].map((item, iKey) => {
      return(
        <>
        {typeBranching("Requirement",item,iKey)}
      </>
      )    

  }
  )

  return(
    <>
        <div>Create template</div>
        <div>Current json: {JSON.stringify(input)}</div>
        <Container>
          <form>
            
              <>
                <div>
                  <TextField
                    name="Name"
                    label="Project Name"
                    variant="filled"
                    value={input.Name}
                    onChange={event => handleChangeInput(input["Name"], event)}
                  />
                </div>
                {reqTemplate}
                <button type="button" className="btn btn-primary mt-2" onClick={handleAddReq}>
                    Add Requirement
                </button>
              </>
          </form> 
        </Container>
    </>
  )
}

export default Create;