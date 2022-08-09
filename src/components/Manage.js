import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { DialogContentText, DialogActions } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import useCollapse from "react-collapsed";
import "./Manage.css";
import Create from "./Create";

function Manage({ state, setState, structClone, data }) {
  const [record, getData] = useState([]);
  const URL = "https://zwcpq1a6qg.execute-api.ap-east-1.amazonaws.com/dev/list";
  //const CataURL = 'https://s3.amazonaws.com/pocbucket2.brian/test3.json'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(URL)
      .then((res) => res.json())

      .then((response) => {
        const temp = JSON.parse(JSON.stringify(response));
        getData(temp);
      });
  };

  const deletePending = useRef("");

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Alert = () => {
    return (
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="deleteConfirm">{"Are you sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The record will be removed.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                remove(deletePending.current);
                handleClose();
              }}
              color="primary"
            >
              Confirm
            </Button>
            <Button onClick={() => handleClose()} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  function Section(props) {
    const config = {
      defaultExpanded: props.defaultExpanded || false,
      collapsedHeight: props.collapsedHeight || 0,
    };
    const { getCollapseProps, getToggleProps, isExpanded } =
      useCollapse(config);
    return (
      <div className="collapsible">
        <div className="header" {...getToggleProps()}>
          <div className="title">
            {props.title.Name}

            <Button
              onClick={() => {
                structClone.current = props.title.Requirement;
                Object.keys(props.title.Requirement).forEach((item) => {
                  if (item !== "0") {
                    data.current[item] = [
                      props.title.Requirement[item].Value[0],
                      props.title.Requirement[item].Value[1],
                    ];
                  }
                });
                const temp = JSON.parse(JSON.stringify(structClone.current));
                setState({
                  structField: temp,
                  nameField: props.title.Name,
                });
              }}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                deletePending.current = props.title.Name;
                handleOpen();
              }}
            >
              Remove
            </Button>
          </div>
          <div className="icon">
            <i
              className={
                "fas fa-chevron-circle-" + (isExpanded ? "up" : "down")
              }
            ></i>
          </div>
        </div>
        <div {...getCollapseProps()}>
          <div className="content">{props.children}</div>
        </div>
      </div>
    );
  }

  const remove = async (Name) => {
    await fetch(
      "https://zwcpq1a6qg.execute-api.ap-east-1.amazonaws.com/dev/delete",
      {
        method: "DELETE",
        body: JSON.stringify({ Name: Name }),
      }
    );
    window.location.reload();
  };

  const DisplayMultiple = (props) => {
    const index = props.objKey;
    const data = props.content;
    return (
      <>
        <div>
          <input type="checkbox" />
          {data[index].Value[0]}:
        </div>

        <div className="newBranchManage">
          {data[index].Successor.map((item) => {
            if (
              data[item].Predecessor === index &&
              data[item].Successor.length === 0
            ) {
              return (
                <DisplaySingle objKey={item} content={data} key={item + "DS"} />
              );
            } else if (data[item].Successor.length !== 0 && item !== "0") {
              return (
                <DisplayMultiple
                  objKey={item}
                  content={data}
                  key={item + "DM"}
                />
              );
            }
            return null;
          })}
        </div>
      </>
    );
  };

  const DisplaySingle = (props) => {
    const index = props.objKey;
    const data = props.content;
    return (
      <>
        <div className="reqDiv">
          <div className="reqDivItem">
            <input type="checkbox" />
            {data[index].Value[0]}
          </div>
          <div className="reqDivItem">
            <a href={data[index].Value[1]}>{data[index].Value[1]}</a>
          </div>
        </div>
      </>
    );
  };

  const RequirementDisplay = (props) => {
    var reqJson = props.reqJson;
    var displayList = [];
    Object.keys(reqJson).forEach((item) => {
      if (
        reqJson[item].Predecessor === "0" &&
        reqJson[item].Successor.length === 0
      ) {
        displayList.push(
          <div key={item + "DS"}>
            <DisplaySingle objKey={item} content={reqJson} />
          </div>
        );
      } else if (
        reqJson[item].Successor.length !== 0 &&
        item !== "0" &&
        reqJson[item].Predecessor === "0"
      ) {
        displayList.push(
          <div key={item + "DM"}>
            <DisplayMultiple objKey={item} content={reqJson} />
          </div>
        );
      }
    });
    return displayList;
  };

  const itemList = record.map((reqItem, i) => {
    return (
      <Section key={i} title={reqItem}>
        <div>Requirements:</div>
        <RequirementDisplay reqJson={reqItem.Requirement} key={reqItem} />
      </Section>
    );
  });

  return (
    <div className="flexContainer">
      <div className="preferences">{itemList}</div>
      <div className="editArea">
        <Create
          state={state}
          setState={setState}
          structClone={structClone}
          data={data}
        />
      </div>
      <Alert />
    </div>
  );
}

export default Manage;
