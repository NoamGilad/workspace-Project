import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext, useRef } from "react";
import Modal from "../../../UI/Modal/Modal";
import styled from "styled-components";

const SelectedUser = styled.div`
  width: 92%;
  display: flex;
  margin: 5px;
  padding: 15px;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  text-align: center;
  padding: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  & div {
    display: flex;
    flex-direction: row;
  }

  & label {
    text-align: justify;
    font-size: medium;
  }

  & input {
    margin-left: 10px;
    margin-right: 10px;
    width: 85%;
    background-color: lightsalmon;
  }
`;

const CloseButton = styled.button`
  background-color: red;

  &:hover {
    background-color: lightcoral;
  }
`;

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
      <SelectedUser>
        <form onSubmit={handleFormSubmit}>
          <label>First Name</label>
          <input
            type="text"
            ref={firstNameRef}
            defaultValue={props.firstName}
          />
          <label>Last Name</label>
          <input type="text" ref={lastNameRef} defaultValue={props.lastName} />
          <input type="number" min="30" ref={amountPerHourRef} />
          <button type="submit">Update</button>
          <CloseButton onClick={() => context.setShowEditUserModal(false)}>
            Close
          </CloseButton>
        </form>
      </SelectedUser>
    </Modal>
  );
};

export default EditUser;
