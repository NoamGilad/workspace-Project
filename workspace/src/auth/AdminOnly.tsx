import { useContext } from "react";
import { AuthCtx } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

const AdminUser: React.FC<{ children: React.ReactNode }> = (props) => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();

  if (context?.loading) return null;

  if (!context || context.role !== "Employer") {
    navigate("/");
    return null;
  }

  return props.children;
};

export default AdminUser;
