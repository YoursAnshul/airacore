import React from "react";

import "./Label.css";

interface PropData {
  title: string;
  showStar: boolean;
  modeError: boolean;
  type: string;
  classNames?: string;
}

export const Label = (props: PropData) => {
  return (
    <>
      {props.modeError === true ? (
        <p className="error">{props.title}</p>
      ) : (
        <label
          className={
            (props.type === "BOLD" ? "bold-text " : "title ") +
            (props.classNames ? props.classNames : "")
          }
        >
          {props.title} {props.showStar && <span className="req1">*</span>}
          <br></br>
        </label>
      )}
    </>
  );
};



Label.defaultProps = {
  title: "",
  showStar: false,
  modeError: false,
  type: "NORMAL",
};
