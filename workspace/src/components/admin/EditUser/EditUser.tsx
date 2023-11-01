import classes from "./EditUser.module.css";
import Modal from "../../../UI/Modal/Modal";
import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext, useRef } from "react";
import Card from "../../../UI/Card/Card";

const EditUser: React.FC<{
  firstName: string;
  lastName: string;
  id: string;
  updateProfileHandler: Function;
}> = (props) => {
  const context = useContext(AuthCtx);
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const amountPerHourRef = useRef<HTMLInputElement | null>(null);

  if (!context) {
    console.error("No context");
    return <p>No context</p>;
  }
  const handleFormSubmit = (e: React.FormEvent) => {
    // e.preventDefault();
    const updatedFirstName = firstNameRef.current?.value || "";
    const updatedLastName = lastNameRef.current?.value || "";
    const updatedAmountPerHour = amountPerHourRef.current?.value
      ? +amountPerHourRef.current?.value
      : 30;

    context.setSelectedUser({
      firstName: updatedFirstName,
      lastName: updatedLastName,
      role: "Employee",
      id: props.id,
      amountPerHour: updatedAmountPerHour,
    });

    props.updateProfileHandler(
      e,
      updatedFirstName,
      updatedLastName,
      props.id,
      updatedAmountPerHour
    );
    context.setShowModal(false);
  };

  return (
    <Modal onClose={() => context.setShowModal(false)}>
      <Card className={classes.selectedUser}>
        <form onSubmit={handleFormSubmit}>
          <label>First Name</label>
          <input
            type="text"
            ref={firstNameRef}
            defaultValue={props.firstName}
          />
          <label>Last Name</label>
          <input type="text" ref={lastNameRef} defaultValue={props.lastName} />
          <input
            type="number"
            defaultValue="30"
            min="30"
            ref={amountPerHourRef}
          />
          <button type="submit">Update</button>
          <button
            onClick={() => context.setShowModal(false)}
            className={classes.closeButton}
          >
            Close
          </button>
        </form>
      </Card>
    </Modal>
  );
};

export default EditUser;
