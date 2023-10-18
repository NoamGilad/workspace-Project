import { useContext } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import UsersList from "../../components/admin/UsersList/UsersList";
import classes from "./EmployerControl.module.css";

const EmployeeControlPage: React.FC = () => {
  const context = useContext(AuthCtx);

  if (!context) return <p>No context</p>;

  return (
    <div className={classes.container}>
      <h1>Admin control page</h1>
      <h2>
        {context.firstName} {context.lastName}
      </h2>
      <UsersList />
    </div>
  );
};

export default EmployeeControlPage;
