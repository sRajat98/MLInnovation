import React from "react";
import ConfusedMan from "../Images/confusedman.png";

const Error = ({ status }) => {
  return (
    <div className="homePage">
      <div className="homePage__errorHeading">Yikes Something Went Wrong</div>
      <img src={ConfusedMan} alt="" className="homePage__errorMan" />
      <span className="homePage__errorReturned">Error Status Returned :</span>
      <div className="homePage__errorStatus">{status}</div>
    </div>
  );
};

export default Error;
