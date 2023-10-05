import { useContext } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import classes from "./EmployeeProfile.module.css";
import CircleLoader from "../../UI/CircleLoader/CircleLoader";
import UserInfo from "../../components/UserInfo/UserInfo";
import Shifts from "../../components/Shifts/Shifts";

const EmployeeProfilePage = () => {
  const context = useContext(AuthCtx);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  const isRole = context.role;

  return (
    <div className={classes.container}>
      <h1 className={classes.h1Welcome}> Welcome</h1>
      {isRole ? (
        <>
          <h1>{context.nameToCapital(context.firstName, context.lastName)!}</h1>
          <div className={classes.cards}>
            {/* all the components right in this div */}
            <div className={classes.cardContainer}>
              <UserInfo />
            </div>
            <div className={classes.cardContainer}>
              <Shifts />
            </div>
          </div>
        </>
      ) : (
        <div>
          <CircleLoader />
        </div>
      )}
    </div>
  );
};

export default EmployeeProfilePage;
