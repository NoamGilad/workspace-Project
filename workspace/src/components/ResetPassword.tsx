import { useContext } from "react";
import { AuthCtx } from "../contexts/AuthProvider";

interface ResetPasswordProps {
  onResetPassword: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
  const context = useContext(AuthCtx);

  return (
    <div>
      <label>Reset your password:</label>
      <label>Email</label>
      <input
        type="email"
        onChange={(e) => context?.setEmail(context.auth?.currentUser?.email)}
        placeholder="Enter your Email"
        required
      />
      <button onSubmit={props.onResetPassword}>Reset password</button>
    </div>
  );
};

export default ResetPassword;
