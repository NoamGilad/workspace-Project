import { useContext } from "react";
import { AuthCtx } from "../contexts/AuthProvider";

import SignUpPage from "./SignUp";
import SignInPage from "./SignIn";
import Summary from "../components/Summary";

const HomePage = () => {
  const context = useContext(AuthCtx);

  let content;

  if (
    context?.userRole === null ||
    context?.userRole !== context?.approvedRoles[0] ||
    context?.userRole !== context?.approvedRoles[1]
  ) {
    content = (
      <>
        <SignInPage /> <SignUpPage />
        <p>No user signed in</p>
      </>
    );
  }

  if (context?.userRole === context?.approvedRoles[0]) {
    content = (
      <>
        <Summary />
      </>
    );
  }

  if (context?.userRole === context?.approvedRoles[1]) {
    console.log(context?.currentUser);
    content = (
      <>
        <div>Hey Admin</div>
        <div>{context?.currentUser}</div>
      </>
    );
  }

  return (
    <>
      <h1>Home page</h1>
      {content}
    </>
  );
};

export default HomePage;
