import React from "react";
import classes from "./Modal.module.css";
import Card from "../Card/Card";

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = (
  props
) => {
  return (
    <Card className={classes.modal}>
      <div className={classes.modalContent}>
        {props.children}
        <button className={classes.modalClose} onClick={props.onClose}>
          Close
        </button>
      </div>
    </Card>
  );
};

export default Modal;
