import { useContext } from "react";
import { AuthCtx } from "../contexts/AuthProvider";

import classes from "./Home.module.css";

const HomePage = () => {
  const context = useContext(AuthCtx);
  const user = context?.user;

  if (context?.role === "employee" || context?.role === "employer") {
    return (
      <div className={classes.container}>
        <h1>
          Welcome {context.role === "employer" ? "Admin " : ""}
          {context.firstName}
        </h1>
        <h2>Account details</h2>
        <p>
          Name: {context.firstName} {context.lastName}
        </p>
        <p>Email: {context.email}</p>
        <p>Role: {context.role}</p>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <h1 className={classes.h1}>Home page</h1>
    </div>
  );
};

export default HomePage;
