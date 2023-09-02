import { useContext } from "react";
import { AuthCtx } from "../contexts/AuthProvider";

const NonAdminSummary = () => {
  const context = useContext(AuthCtx);

  return (
    <>
      <header>Hello {context?.email}</header>
      <p>Your summary</p>
    </>
  );
};

export default NonAdminSummary;
