import React from "react";

const DialogBox = ({ text, setIsDialogVisible }) => {
  return (
    <div className="homePage__dialogBoxBackground">
      <div className="homePage__dialogBox">
        <div
          className="homePage__dialogBox--closeButton"
          style={
            {
              // width: "100%",
              // textAlign: "center",
              // fontWeight: "bolder",
              // cursor: "pointer",
              // marginLeft: "92%",
              // width: "10%",
              // height: "3rem",
              // marginBottom: "1rem",
              // border: "1px solid black",
            }
          }
          onClick={() => setIsDialogVisible(false)}
        >
          X
        </div>
        {text}
      </div>
    </div>
  );
};

export default DialogBox;
