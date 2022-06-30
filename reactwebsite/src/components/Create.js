import React, { useState } from "react";
import "./Create.css";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import RemoveIcon from '@mui/icons-material/Remove';

function Create() {
  const [input, setInput] = useState([
    {Name:"", Requirement:[{"Type":"Single","Value":["",""]}]},
  ])

  const handleChangeInput = (recKey, event) => {
    const newInputFields = input.map(i => {
      if(recKey === i.Name) {
        i[event.target.name] = event.target.value
      }
      return i;
    })
    setInput(newInputFields);
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
            {input.map((records, i) => (
              <>
                <div>
                  <TextField
                    name="Name"
                    label="Project Name"
                    variant="filled"
                    value={input.Name}
                    onChange={event => handleChangeInput(records["Name"], event)}
                  />
                </div>
                <div key="0">
                  <TextField
                    name="Requirement"
                    label="Requirement Item"
                    variant="filled"
                    value={input.Requirement}
                    onChange={event => handleChangeInput(records["Name"], event)}
                  />
                  <TextField
                    name="Requirement"
                    label="URL(Optional)"
                    variant="filled"
                    value={input.Requirement}
                    onChange={event => handleChangeInput(records["Name"], event)}
                  />
                </div>
              </>
            ))}
          </form> 
        </Container>
    </>


  )

  
  
}

export default Create;