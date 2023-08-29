import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import Summary from "../components/Summary";
import Login from "../components/Login";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const content = isLoggedIn ? <Summary /> : <Login />;

  return (
    <>
      <h1>Home page</h1>
      {content}
    </>
  );
};

export default HomePage;
