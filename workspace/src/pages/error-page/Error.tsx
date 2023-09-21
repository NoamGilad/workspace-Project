import MainNavigation from "../../components/MainNavigation";

import classes from "./Error.module.css";

const ErrorPage = () => {
  return (
    <>
      <MainNavigation />
      <main className={classes.errorContainer}>
        <h1>An error occurred!</h1>
        <p>Could not find this page!</p>
      </main>
    </>
  );
};

export default ErrorPage;
