import React from "react";
import classes from "./Modal.module.css";

const Modal: React.FC<{ onClose: () => void; children: any }> = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.modalContent}>
        {props.children}
        <button className={classes.modalClose} onClick={props.onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
