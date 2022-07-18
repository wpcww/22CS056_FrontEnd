import { Button } from '@mui/material';
import React, {useState, useEffect} from 'react'
import useCollapse from 'react-collapsed';
import './Manage.css';
import Create from './Create';

function Manage() {
    const [record, getData] = useState([])
    const URL = 'https://eszevlom66.execute-api.ap-east-1.amazonaws.com/default/joblist'
    //const CataURL = 'https://s3.amazonaws.com/pocbucket2.brian/test3.json'

    useEffect(() => {
        fetchData()
    }, [])

    const [showCreate, setShowCreate] = useState(false)
    const CreateBlock = () =>{
        return (
            <div>
                {showCreate ? <Create /> : null}
            </div>
        )
    }


    const fetchData = () => {
        fetch(URL)
          .then((res) =>
            res.json())
     
          .then((response) => {
            console.log(response);
            const temp = JSON.parse(JSON.stringify(response))
            getData(temp);
          }) 
    }

    function Section(props) {
        const config = {
            defaultExpanded: props.defaultExpanded || false,
            collapsedHeight: props.collapsedHeight || 0
        };
        const { getCollapseProps, getToggleProps, isExpanded } = useCollapse(config);
    return (
        <div className="collapsible">
            <div className="header" {...getToggleProps()}>
                <div className="title">{props.title.Name}
                <Button onClick={() => setShowCreate(true)}>Edit</Button>
                <Button onClick={() => remove(props.title.Name)}>Remove</Button>
                </div>
                <div className="icon">
                    <i className={'fas fa-chevron-circle-' + (isExpanded ? 'up' : 'down')}></i>
                </div>
            </div>
            <div {...getCollapseProps()}>
                <div className="content">
                    {props.children}
                </div>
            </div>
        </div>
        );
    }

    const remove = async (Name) => {
        await fetch('https://5msl1adfyb.execute-api.ap-east-1.amazonaws.com/test/remove', {
        method: 'DELETE',
        body: JSON.stringify({"Name":Name})
    }).then(window.location.reload())
    }

    const DisplayMultiple = (props) => {
        const index = props.objKey
        const data = props.content
        return (
            <>
                <div><input type="checkbox"/>{data[index].Value[0]}:</div>
                
                <div className='newBranch'>
                {
                    data[index].Successor.forEach(item =>{
                        if (data[item].Predecessor === index && data[item].Successor.length === 0){
                            console.log("Inner Single: " + data[item])
                          return(<DisplaySingle objKey={item} content={data}/>)
                        }else if(data[item].Successor.length !== 0 && item !== "0"){
                            console.log("Inner Multi: " + data[item])
                          return(<DisplayMultiple objKey={item} content={data}/>)
                        }
                    })
                }
                
                </div>
            </>
        )
    }

    const DisplaySingle = (props) => {
        const index = props.objKey
        const data = props.content
        //console.log(data[index])
        return (
            <>
                <div className='reqDiv'>
                        <div className='reqDivItem'><input type="checkbox"/>{data[index].Value[0]}</div>
                        <div className='reqDivItem'><a href={data[index].Value[1]}>{data[index].Value[1]}</a></div>
                </div>
            </>
        )
    }

    const RequirementDisplay = (props) => {
        //console.log()
        var reqJson = props.reqJson
        var displayList = []
        Object.keys(reqJson).forEach(item => {
        //console.log(reqJson[item])
          if(reqJson[item].Predecessor === "0" && reqJson[item].Successor.length === 0){
            console.log("Single: " + reqJson[item].Value[0])
            displayList.push(
              <>
                <DisplaySingle objKey={item} content={reqJson}/>
              </>
            )
          }else if(reqJson[item].Successor.length !== 0 && item !== "0" && reqJson[item].Predecessor === "0"){
            console.log("Multi: " + reqJson[item].Value[0])
            displayList.push(
              <>
                <DisplayMultiple objKey={item} content={reqJson}/>
              </>
            )
          }
        }
        )
        return displayList
      }

    const itemList2 = record.map((reqItem, i) => {
        return (
            <Section key={i} title={reqItem}>
                <div>Requirements:</div>
                <RequirementDisplay reqJson = {reqItem.Requirement}/>
                
            </Section>
        )

    })

    return (
        <div className="preferences" class="flexbox-container">

            {itemList2}
            <CreateBlock />

       </div>
    );
}

export default Manage;