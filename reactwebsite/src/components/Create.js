import React, { useState } from "react";
import "./Create.css";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import RemoveIcon from '@mui/icons-material/Remove';

function Create() {
  const [input, setInput] = useState(
    {Name:"", Requirement:[{"Type":"Single","Value":["",""]}]},
  )

  const handleChangeInput = (recKey, event) => {
    const temp = JSON.parse(JSON.stringify(input));
    temp["Name"]=event.target.value
    setInput(temp);
  }

  const handleChangeRequirement = (iKey, recKey, event) => {
    const temp = JSON.parse(JSON.stringify(input));
    temp["Requirement"][iKey]["Value"][recKey]=event.target.value
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

  const reqTemplate = input["Requirement"].map((item, iKey) => {
    return(
      <>
      <div key={iKey.toString()}>
        <TextField
          name="Requirement"
          label="Requirement Item"
          variant="filled"
          value={item["Value"][0]}
          onChange={event => handleChangeRequirement(iKey, 0, event)}
        />
        <TextField
          name="Requirement"
          label="URL(Optional)"
          variant="filled"
          value={item["Value"][1]}
          onChange={event => handleChangeRequirement(iKey, 1, event)}
        />
        <RemoveIcon type="button" onClick={() => handleRemoveField(iKey)} />
        </div>
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