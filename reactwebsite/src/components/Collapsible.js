import React, {useState, useEffect} from 'react'
import useCollapse from 'react-collapsed';
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

function Branching(json){

    if (json["Type"] === "Single"){
        return(
            <div className='reqDiv'>
                        <div className='reqDivItem'><input type="checkbox"/>{json["Value"][0]}</div>
                        <div className='reqDivItem'><a href={json["Value"][1]}>{json["Value"][1]}</a></div>
            </div>
        )
    }else{
        return(
            <>
                <div><input type="checkbox"/>{json["Value"][0]}:</div>
                
                <div className='newBranch'>----------------
                {json["Branch"].map((branchList) => {
                    return(
                        Branching(branchList)
                    )
                    
                })}
                </div>    
            </>
        )
    }
}

function Collapsible() {
    const record2 = [{
        "Name": "Project Name",
        "Requirement": {
          "0": {
            "Predecessor": null,
            "Successor": [
              "603cb6a7-a8a5-4677-878a-713ae6edf66f",
              "6679019c-bd28-4498-a50a-75115c1f6c9d",
              "77c8e50e-9467-4cfc-b2cb-78488d6ec951"
            ]
          },
          "603cb6a7-a8a5-4677-878a-713ae6edf66f": {
            "Predecessor": "0",
            "Successor": [
              "fce2c1b0-3413-40de-b11d-a0d059e4a007",
              "078357e6-a813-4105-93ac-41ca77e63e5e"
            ],
            "Value": [
              "Requirement1",
              ""
            ]
          },
          "fce2c1b0-3413-40de-b11d-a0d059e4a007": {
            "Predecessor": "603cb6a7-a8a5-4677-878a-713ae6edf66f",
            "Successor": [
              "fc39f0c6-229c-4e4b-b887-5ce34dd606fa"
            ],
            "Value": [
              "Requirement1-1",
              ""
            ]
          },
          "6679019c-bd28-4498-a50a-75115c1f6c9d": {
            "Predecessor": "0",
            "Successor": [],
            "Value": [
              "Requirement2",
              "www"
            ]
          },
          "77c8e50e-9467-4cfc-b2cb-78488d6ec951": {
            "Predecessor": "0",
            "Successor": [],
            "Value": [
              "Requirement3",
              ""
            ]
          },
          "fc39f0c6-229c-4e4b-b887-5ce34dd606fa": {
            "Predecessor": "fce2c1b0-3413-40de-b11d-a0d059e4a007",
            "Successor": [],
            "Value": [
              "Requirement1-1-1",
              ""
            ]
          },
          "078357e6-a813-4105-93ac-41ca77e63e5e": {
            "Predecessor": "603cb6a7-a8a5-4677-878a-713ae6edf66f",
            "Successor": [],
            "Value": [
              "Requirement1-2",
              ""
            ]
          }
        }
      }]
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
            console.log(response);
            getData(response);
          })
        
        

          
     
    }
    
    const itemList = record.map((data,i) => {
        return (
            <Section key={i} title={data.Name}>
                <div>Requirements:</div>
                {data.Requirement.map((ReqList) => {
                    return (
                    <>
                        {Branching(ReqList)}
                    </>
                        
                        
                )})}
            </Section>
        )
    })

    const DisplayMultiple = (props) => {
        const index = props.objKey
        const data = props.content
        return (
            <>
                <div><input type="checkbox"/>{data[index].Value[0]}:</div>
                
                <div className='newBranch'>
                {
                    data[index].Successor.map(item =>{
                        if (data[index].Predecessor === index && data[index].Successor.length === 0){
                            //console.log("Single: " + data[item])
                          return(<DisplaySingle objKey={item} content={data}/>)
                        }else if(data[index].Successor.length !== 0 && item !== "0"){
                            //console.log("Multi: " + data[item])
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
        console.log(data)
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
        Object.keys(reqJson).map(item => {
        //console.log(reqJson[item])
          if(reqJson[item].Predecessor === "0" && reqJson[item].Successor.length === 0){
            displayList.push(
              <>
                <DisplaySingle objKey={item} content={reqJson}/>
              </>
            )
          }else if(reqJson[item].Successor.length !== 0 && item !== "0" && reqJson[item].Predecessor === "0"){
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

    const itemList2 = record2.map((reqItem, i) => {
        return (
            <Section key={i} title={reqItem.Name}>
                <div>Requirements:</div>
                <RequirementDisplay reqJson = {reqItem.Requirement}/>
                
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