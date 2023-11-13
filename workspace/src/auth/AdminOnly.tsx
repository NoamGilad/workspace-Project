import { useContext } from "react";
import { AuthCtx } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

const AdminOnly: React.FC<{ children: React.ReactNode }> = (props) => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();

  if (!context || context.role !== "Employer" || !context.loggedIn) {
    navigate("/");
    return null;
  }

  return props.children;
};

export default AdminOnly;
