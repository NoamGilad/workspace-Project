import { Link, useNavigate, useNavigation } from "react-router-dom";
import { AuthCtx } from "../contexts/AuthProvider";
import { useContext, useState } from "react";
import { AuthProvider } from "../contexts/AuthProvider";

const SignInPage = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  if (!context) {
    return <div>Loading...</div>;
  }

  const { auth } = context;

  if (!auth) {
    return <div>No authentication avilable</div>;
  }

  const onSubmitLoginHandler = (e: React.FormEvent) => {
    e.preventDefault();

    context.onSubmitLoginHandler(e);

    return navigate("/");
  };

  return (
    <>
      <h5>Sign in</h5>
      <form onSubmit={onSubmitLoginHandler}>
        <main>
          <label>Email</label>
          <input
            type="email"
            onChange={(e) => context.setEmail(e.target.value)}
            placeholder="Enter your Email"
            required
          />
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => context.setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Login"}
          </button>
        </main>
        <label>New account?</label>
        <Link to={"/signup"}>Sign up</Link>
      </form>
    </>
  );
};

export default SignInPage;
