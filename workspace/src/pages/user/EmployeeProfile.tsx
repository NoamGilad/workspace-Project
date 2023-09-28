import { useContext } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import classes from "./EmployeeProfile.module.css";
import CircleLoader from "../../UI/CircleLoader/CircleLoader";

const EmployeeProfilePage = () => {
  const context = useContext(AuthCtx);

  if (!context) {
    console.error("No context!");
    return <div>No context!</div>;
  }

  const isRole = context.role;

  return (
    <div className={classes.container}>
      <h1>My profile</h1>

      {isRole ? (
        <h2>
          Welcome {context.nameToCapital(context.firstName, context.lastName)!}
        </h2>
      ) : (
        <CircleLoader />
      )}
    </div>
  );
};

export default EmployeeProfilePage;
