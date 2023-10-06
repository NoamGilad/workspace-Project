import { useContext, useEffect } from "react";
import { AuthCtx } from "../contexts/AuthProvider";

import classes from "./Home.module.css";
import Card from "../UI/Card/Card";

const HomePage = () => {
  const context = useContext(AuthCtx);

  useEffect(() => {
    console.log("isSubmitting changed to:", context?.isSubmitting);
    console.log("isLoggedIn changed to:", context?.loggedIn);

    // Rest of your useEffect logic
  }, [context?.isSubmitting, context?.loggedIn]);

  return (
    <div className={classes.container}>
      <h1 className={classes.h1}>WorkEase</h1>
      <Card className={classes.homeCard}>
        <p>
          Welcome to WorkEase, the user-friendly workspace platform designed to
          streamline collaboration between employers and employees.
        </p>
        <p>
          Our simple and effective features cater to the essential needs of both
          roles, making work organization a breeze.
        </p>
      </Card>
    </div>
  );
};

export default HomePage;
