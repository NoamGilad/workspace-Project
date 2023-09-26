import { useContext, useState } from "react";
import { AuthCtx } from "../contexts/AuthProvider";
import Modal from "../UI/Modal/Modal";

interface ResetPasswordProps {
  onResetPassword: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
  const context = useContext(AuthCtx);

  return (
    <Modal onClose={() => context?.setShowModal(false)}>
      <label>Reset your password:</label>
      <p>Email</p>
      <input
        type="email"
        onChange={(e) => context?.setEmail(e.target.value)}
        placeholder="Enter your Email"
        required
      />
      <button onClick={props.onResetPassword}>Reset password</button>
      <button onClick={() => context?.setShowModal(false)}>Close</button>
    </Modal>
  );
};

export default ResetPassword;
