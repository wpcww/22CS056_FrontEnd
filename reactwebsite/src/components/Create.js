import React, { useState } from "react";
import "./Create.css";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import RemoveIcon from '@mui/icons-material/Remove';

function Create() {
  const [input, setInput] = useState([
    {Name:"A", Requirement:[]},
    {Name:"B", Requirement:[]}
  ])

  const handleChangeInput = (id, event) => {
    const newInputFields = input.map(i => {
      if(id === i.id) {
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
        <Container>
          <form>
            { input.map((records, i) => (
              <div key={i}>
                <TextField
                  name="name"
                  label="Project Name"
                  variant="filled"
                  value={input.Name}
                />
              </div>
            ))}
          </form> 
        </Container>
    </>


  )

  
  
}

export default Create;