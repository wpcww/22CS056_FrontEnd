import React, {useState, useEffect} from 'react'
import './Body.css'

function Body(){
    const [data, getData] = useState([])
    const URL = 'https://s3.amazonaws.com/pocbucket2.brian/test.json'

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        fetch(URL)
          .then((res) =>
            res.json())
     
          .then((response) => {
            console.log(response);
            getData(response);
          })
     
    }

    return(
        <>
        <div className='mainArea'>
        <tbody>
                <tr>
                    <th>Checklist</th>
                    <th>Id</th>
                    <th>Description</th>
                    <th>Attachment</th>
                </tr>
                {Object.values(data).map((item, i) => (
                    <tr key={i}>
                        <td>{item.Type}</td>
                        <td>{i}</td>
                        <td>{item.Requirement[0][0]["Description1"]}</td>
                        <td>{item.Requirement[0][1]["AttachmentURL"]}</td>
                    </tr>
                ))}
            </tbody>
        </div>

        </>

    )
}

export default Body;