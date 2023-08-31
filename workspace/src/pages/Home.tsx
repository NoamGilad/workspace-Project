import { useContext, useState } from "react";
import { AuthCtx } from "../contexts/AuthProvider";

import Summary from "../components/Summary";

const HomePage = () => {
  const ctxUser = useContext(AuthCtx);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const content = isLoggedIn ? (
    <Summary />
  ) : (
    <h2>Welcome! please login or sign up</h2>
  );

  return (
    <>
      <h1>Home page</h1>
      {content}
    </>
  );
};

export default HomePage;
