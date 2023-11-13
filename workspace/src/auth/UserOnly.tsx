import { useContext } from "react";
import { AuthCtx } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

const UserOnly: React.FC<{ children: React.ReactNode }> = (props) => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();

  if (!context?.loading)
    if (!context || context.role !== "Employee" || !context.loggedIn) {
      navigate("/");
      return null;
    }

  return props.children;
};

export default UserOnly;