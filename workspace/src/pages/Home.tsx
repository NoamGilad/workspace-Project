import { useContext } from "react";
import { AuthCtx } from "../contexts/AuthProvider";

import classes from "./Home.module.css";

const HomePage = () => {
  const context = useContext(AuthCtx);

  let content;

  if (!context || context === null) {
    window.alert("No context!");
    content = <div className={classes.container}>No context!</div>;
  }

  if (context?.isSubmitting && !context?.loggedIn) {
    content = <div className={classes.container}>Loading...</div>;
  }

  if (
    (context?.loggedIn &&
      context?.auth?.currentUser &&
      context?.role === "Employee") ||
    context?.role === "Employer"
  ) {
    content = (
      <div className={classes.container}>
        <h1>
          Welcome {context.role === "Employer" ? "Admin " : ""}
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
      <div className={classes.container}>
        <h1>
          Welcome {context?.role === "Employer" ? "Admin " : ""}
          {context?.firstName}
        </h1>
        <h2>Account details</h2>
        <p>
          Name: {context?.firstName} {context?.lastName}
        </p>
        <p>Email: {context?.email}</p>
        <p>Role: {context?.role}</p>
      </div>
    </div>
  );
};

export default HomePage;
