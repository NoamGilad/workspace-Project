import UsersList from "../../components/admin/UsersList/UsersList";
import classes from "./EmployerControl.module.css";

const EmployeeControlPage: React.FC = () => {
  return (
    <div className={classes.container}>
      <h1>Admin control page</h1>
      <UsersList />
    </div>
  );
};

export default EmployeeControlPage;
