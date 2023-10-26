import { useContext } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import UsersList from "../../../components/admin/UsersList/UsersList";
import classes from "./EmployerControl.module.css";
import AddUser from "../../../components/admin/AddUser/AddUser";

const EmployeeControlPage: React.FC = () => {
  const context = useContext(AuthCtx);

  if (!context) return <p>No context</p>;

  const handleShowAddUser = () => {
    context.setShowModal(true);
  };

  return (
    <div className={classes.container}>
      <h1>{context.company.name}</h1>
      <h2>Admin control page</h2>
      <h3>
        Employer: {context.firstName} {context.lastName}
      </h3>

      {context?.showModal && context?.isSubmitting === false ? (
        <AddUser />
      ) : (
        <button
          onClick={() => {
            handleShowAddUser();
          }}
        >
          Add employee
        </button>
      )}

      <UsersList />
    </div>
  );
};

export default EmployeeControlPage;
