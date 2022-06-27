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
function Collapsible() {
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
    
    const itemList = data.map((data,i) => {
        return (
            <Section key={i} title={data.Type}>
                <div>Requirements:</div>
                {data.Requirement.map((desc, j) => {
                    return (
                    <>
                    <div className='reqDiv'>
                        <div className='reqDivItem'><input type="checkbox"/>{desc["Description"]}</div>
                        <div className='reqDivItem'><a href={desc["AttachmentURL"]}>{desc["AttachmentURL"]}</a></div>
                    </div>
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