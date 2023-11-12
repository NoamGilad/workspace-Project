import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext, useRef } from "react";
import Modal from "../../../UI/Modal/Modal";
import { ButtonDiv, CloseButton, ModalContainer } from "../AddUser/AddUser";

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
    context.setShowEditUserModal(false);
  };

  return (
    <Modal onClose={() => context.setShowEditUserModal(false)}>
      <ModalContainer>
        <form onSubmit={handleFormSubmit}>
          <label>First Name</label>
          <input
            type="text"
            ref={firstNameRef}
            defaultValue={props.firstName}
          />
          <label>Last Name</label>
          <input type="text" ref={lastNameRef} defaultValue={props.lastName} />
          <label>Hourly wage</label>
          <input type="number" min="30" ref={amountPerHourRef} />
          <ButtonDiv>
            <button type="submit">Update</button>
            <CloseButton onClick={() => context.setShowEditUserModal(false)}>
              Close
            </CloseButton>
          </ButtonDiv>
        </form>
      </ModalContainer>
    </Modal>
  );
};

export default EditUser;
