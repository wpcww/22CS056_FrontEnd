import React, { useState } from "react";
import "./Create.css";

function generate(){
    return(
        <div></div>
    )
}

function Create() {
  const [input, setInput] = useState([
    {Name:"", Requirement:[]}
  ])
  return(
    <>
        <div>Create template</div>
        <form>
          { input.map((records, i) => (
            <div key={i}>
              <input type="text"/>
            </div>
          ))}
        </form>
    </>


  )

  
  
}

export default Create;