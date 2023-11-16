import { useContext, useState } from "react";
import { AuthCtx } from "../contexts/AuthProvider";
import Modal from "../UI/Modal/Modal";
import {
  ButtonDiv,
  CloseButton,
  ModalContainer,
} from "../components/admin/AddUser/AddUser";

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
      <ModalContainer>
        <label>Reset your password</label>
        <input
          type="email"
          onChange={(e) => context?.setEmail(e.target.value)}
          placeholder="Enter your Email"
          required
        />
        <ButtonDiv>
          <button onClick={props.onResetPassword}>Reset</button>
          <CloseButton onClick={() => context.setShowResetModal(false)}>
            Close
          </CloseButton>
        </ButtonDiv>
      </ModalContainer>
    </Modal>
  );
};

export default ResetPassword;
