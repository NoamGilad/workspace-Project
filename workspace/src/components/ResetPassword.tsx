import { useContext, useState } from "react";
import { AuthCtx } from "../contexts/AuthProvider";
import Modal from "../UI/Modal/Modal";
import styled from "styled-components";

const CloseButton = styled.button`
  background-color: red;

  &:hover {
    background-color: lightcoral;
  }
`;

interface ResetPasswordProps {
  onResetPassword: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
  const context = useContext(AuthCtx);
  if (!context) {
    console.error("No context!");
    return;
  }

  return (
    <Modal onClose={() => context.setShowResetModal(false)}>
      <label>Reset your password:</label>
      <p>Email</p>
      <input
        type="email"
        onChange={(e) => context?.setEmail(e.target.value)}
        placeholder="Enter your Email"
        required
      />
      <button onClick={props.onResetPassword}>Reset</button>
      <CloseButton onClick={() => context.setShowResetModal(false)}>
        Close
      </CloseButton>
    </Modal>
  );
};

export default ResetPassword;
