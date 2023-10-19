import classes from "./EditUser.module.css";
import Modal from "../../../UI/Modal/Modal";
import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext } from "react";

const EditUser: React.FC<{
  firstName: string;
  lastName: string;
  id: string;
}> = (props) => {
  const context = useContext(AuthCtx);

  if (!context) return <p>No context</p>;

  return (
    <Modal onClose={() => context?.setShowModal(false)}>
      <div className={classes.selectedUser}>
        <div>
          <label>First Name</label>
          <input defaultValue={props.firstName} />
          <button>Update</button>
        </div>
        <div>
          <label>Last Name</label>
          <input defaultValue={props.lastName} /> <button>Update</button>
        </div>
        <div>
          <label>Email</label>
          <input defaultValue={props.id} /> <button>Update</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditUser;
