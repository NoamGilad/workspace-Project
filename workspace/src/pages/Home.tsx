import { useContext } from "react";
import { AuthCtx } from "../contexts/AuthProvider";

import SignUpPage from "./SignUp";
import SignInPage from "./SignIn";
import NonAdminSummary from "../components/NonAdminSummary";

const HomePage = () => {
  const context = useContext(AuthCtx);

  // let content;

  // if (context?.auth === null) {
  //   content = (
  //     <>
  //       <SignInPage /> <SignUpPage />
  //       <p>No user signed in</p>
  //     </>
  //   );
  // }

  // if (context?.curUserRole === "employee") {
  //   content = (
  //     <>
  //       <NonAdminSummary />
  //       <div>{context?.auth}</div>
  //     </>
  //   );
  // }

  // if (context?.auth === "employer") {
  //   console.log(context?.auth);
  //   content = (
  //     <>
  //       <div>Hey Admin</div>
  //       <div>{context?.auth}</div>
  //     </>
  //   );
  // }

  return (
    <>
      <h1>Home page</h1>
      <p>{context?.email}</p>
      <p>{context?.password}</p>
    </>
  );
};

export default HomePage;
