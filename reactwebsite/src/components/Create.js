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

  const handleChangeRequirement = (recKey, event) => {
    const temp = JSON.parse(JSON.stringify(input));
    temp["Requirement"][0]["Value"][recKey]=event.target.value
    setInput(temp);
  }

  const handleAddFields = () => {
    setInput([...input, { Name:'',  Requirement:[] }])
  }

  const handleRemoveFields = id => {
    const values  = [...input];
    values.splice(values.findIndex(value => value.id === id), 1);
    setInput(values);
  }

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
                <div key="0">
                  <TextField
                    name="Requirement"
                    label="Requirement Item"
                    variant="filled"
                    value={input.Requirement[0][0]}
                    onChange={event => handleChangeRequirement(0, event)}
                  />
                  <TextField
                    name="Requirement"
                    label="URL(Optional)"
                    variant="filled"
                    value={input.Requirement[0][1]}
                    onChange={event => handleChangeRequirement(1, event)}
                  />
                </div>
              </>
          </form> 
        </Container>
    </>


  )

  
  
}

export default Create;