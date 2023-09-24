import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { AuthCtx } from "../../contexts/AuthProvider";

import classes from "./SignIn.module.css";
import CircleLoader from "../../UI/CircleLoader";

const SignInPage: React.FC<{ user: any }> = (props) => {
  const context = useContext(AuthCtx);

  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!context) {
      window.alert("No context!");
      return;
    }

    const email = context?.email;
    const password = context?.password;

    if (!email || !password) {
      window.alert("Please provide both email and password.");
      return;
    }

    console.log("Logging in...");

    try {
      await context.login();

      console.log("Login successful:", context?.loggedIn);

      if (context?.loggedIn) {
        navigate("/");
      } else {
        window.alert("Login problem");
        console.log("Login problem:", context.loggedIn, context.isSubmitting);
      }
    } catch (error) {
      console.error("Login error:", error);
      window.alert("Login problem");
    } finally {
      context.setIsSubmitting(false);
    }
  };

  return (
    <div className={classes.container}>
      <h5>Sign in</h5>
      <form onSubmit={handleLoginSubmit}>
        <main>
          <label>Email</label>
          <input
            type="email"
            onChange={(e) => context?.setEmail(e.target.value)}
            placeholder="Enter your Email"
            required
          />
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => context?.setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="submit" disabled={context?.isSubmitting}>
            {context?.isSubmitting ? <CircleLoader /> : "Login"}
          </button>
        </main>
        <label>New account? </label>
        <Link to={"/signup"}>Sign up</Link>
      </form>
    </div>
  );
};

export default SignInPage;
