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
    const [record, getData] = useState([])
    const URL = 'https://eszevlom66.execute-api.ap-east-1.amazonaws.com/default/joblist'
    const CataURL = 'https://s3.amazonaws.com/pocbucket2.brian/test3.json'

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

    return (
        <div className="preferences">

            {itemList}

       </div>
    );
}

export default Collapsible;