import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import Summary from "../components/Summary";

const HomePage = () => {
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
