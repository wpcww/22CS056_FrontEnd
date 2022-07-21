import React, {useState, useEffect} from 'react'
import useCollapse from 'react-collapsed';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import './Collapsible.css';
function Section(props) {
    const config = {
        defaultExpanded: props.defaultExpanded || false,
        collapsedHeight: props.collapsedHeight || 0
    };
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse(config);
return (
    <div className="collapsible">
        <div className="header" {...getToggleProps()}>
            <div className="title">{props.title}</div>
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

function Collapsible() {
    
    const [record, getData] = useState([])
    const URL = 'https://eszevlom66.execute-api.ap-east-1.amazonaws.com/default/joblist'
    //const CataURL = 'https://s3.amazonaws.com/pocbucket2.brian/test3.json'

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        
        fetch(URL)
          .then((res) =>
            res.json())
     
          .then((response) => {
            //console.log(response);
            getData(response);
          })
    }

    const DisplayMultiple = (props) => {
        const index = props.objKey
        const data = props.content
        return (
            <>
                {/* <div><input type="checkbox"/>{data[index].Value[0]}:</div> */}
                <ListItem>
                  <ListItemIcon>
                    <Checkbox />
                  </ListItemIcon>
                  <ListItemText primary={data[index].Value[0]} />
                </ListItem>
                
                <div className='newBranch'>
                {
                    data[index].Successor.map(item =>{
                        if (data[item].Predecessor === index && data[item].Successor.length === 0){
                          return(<DisplaySingle objKey={item} content={data} key={item + "DS"}/>)
                        }else if(data[item].Successor.length !== 0 && item !== "0"){
                          return(<DisplayMultiple objKey={item} content={data} key={item + "DM"}/>)
                        }return null
                    }
                  )
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
                        {/* <div className='reqDivItem'><input type="checkbox"/>{data[index].Value[0]}</div> */}
                        {/* <div className='reqDivItem'><a href={data[index].Value[1]}>{data[index].Value[1]}</a></div> */}
                        <ListItem>
                          <ListItemIcon>
                            <Checkbox />
                          </ListItemIcon>
                          <ListItemText primary={data[index].Value[0]} secondary={data[index].Value[1]}/>
                        </ListItem>
                </div>
            </>
        )
    }

    const RequirementDisplay = (props) => {
        //console.log()
        var reqJson = props.reqJson
        var displayList = []
        Object.keys(reqJson).map(item => {
        //console.log(reqJson[item])
          if(reqJson[item].Predecessor === "0" && reqJson[item].Successor.length === 0){
            //console.log("Single: " + reqJson[item].Value[0])
            displayList.push(
              <div key={item + "DS"}>
                <DisplaySingle objKey={item} content={reqJson}/>
              </div>
            )
          }else if(reqJson[item].Successor.length !== 0 && item !== "0" && reqJson[item].Predecessor === "0"){
            //console.log("Multi: " + reqJson[item].Value[0])
            displayList.push(
              <div key={item + "DM"}>
                <DisplayMultiple objKey={item} content={reqJson}/>
              </div>
            )
          }return null
        }
        )
        return displayList
      }

    const itemList2 = record.map((reqItem, i) => {
        return (
            <Section key={i} title={reqItem.Name}>
              <List>
                <div>Requirements:</div>
                <RequirementDisplay reqJson = {reqItem.Requirement}/>
              </List>
            </Section>
        )

    })

    return (
        <div className="preferences">

            {itemList2}

       </div>
    );
}

export default Collapsible;