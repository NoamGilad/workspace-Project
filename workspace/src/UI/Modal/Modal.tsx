import ReactDOM from "react-dom";

import classes from "./Modal.module.css";

const BackDrop: React.FC<{ onClose: any }> = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose} />;
};

const ModalOverlay: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Modal: React.FC<{ children: React.ReactNode; onClose: any }> = (
  props
) => {
  if (!portalElement) {
    return null;
  }

  return (
    <div>
      {ReactDOM.createPortal(
        <BackDrop onClose={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </div>
  );
};

export default Modal;
