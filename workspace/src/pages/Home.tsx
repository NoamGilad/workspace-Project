import { useContext, useEffect } from "react";
import { AuthCtx } from "../contexts/AuthProvider";

import classes from "./Home.module.css";
import CircleLoader from "../UI/CircleLoader/CircleLoader";

const HomePage = () => {
  const context = useContext(AuthCtx);

  let content;

  if (!context || context === null) {
    window.alert("No context!");
    content = <div className={classes.container}>No context!</div>;
  } else if (context.auth?.currentUser === null) {
    content = <div className={classes.container}>Please login.</div>;
  } else if (
    (context.loggedIn &&
      context.auth?.currentUser &&
      context.role === "Employee") ||
    context.role === "Employer"
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

  useEffect(() => {
    console.log("isSubmitting changed to:", context?.isSubmitting);
    console.log("isLoggedIn changed to:", context?.loggedIn);

    // Rest of your useEffect logic
  }, [context?.isSubmitting, context?.loggedIn]);

  return (
    <div className={classes.container}>
      <h1 className={classes.h1}>Home page</h1>
      {content}
    </div>
  );
};

export default HomePage;
