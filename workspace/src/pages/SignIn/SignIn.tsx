import { useContext, useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { AuthCtx } from "../../contexts/AuthProvider";

import classes from "./SignIn.module.css";
import CircleLoader from "../../UI/CircleLoader/CircleLoader";

import { sendPasswordResetEmail } from "firebase/auth";
import ResetPassword from "../../components/ResetPassword";

const SignInPage: React.FC<{ user: any }> = (props) => {
  const context = useContext(AuthCtx);

  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!context) {
      window.alert("No context!");
      return;
    }

    try {
      const loginSuccess = await context.login();

      if (loginSuccess && context.role === "Employee") {
        navigate("/user");
      }
      if (loginSuccess && context.role === "Employer") {
        navigate("/admin");
      }
      if (!loginSuccess) {
        window.alert("Login problem");
        console.log(context.loggedIn, context.isSubmitting);
      }
    } catch (error) {
      console.error(error);
      window.alert("Login problem");
    } finally {
      context.setIsSubmitting(false);
    }
  };

  const handleResetPassword = () => {
    if (!context?.auth || context.auth === null) {
      console.log("No auth");
      return;
    }
    if (!context?.email || context.email === null) {
      console.log("No email");
      window.alert("Please enter your email.");
      return;
    }

    sendPasswordResetEmail(context.auth, context.email)
      .then(() => {
        console.log("Password reset email sent!");
        console.log(context.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert(errorMessage);
        console.log(`Error code:`, errorCode, "Errror message:", errorMessage);
      });
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
      </form>
      <label>Forgot your password?</label>
      <button
        className={classes.resetButton}
        onClick={() => context?.setShowModal(true)}
      >
        Reset password
      </button>
      {context?.showModal && (
        <ResetPassword onResetPassword={handleResetPassword} />
      )}
      <label>New account? </label>
      <Link to={"/signup"}>Sign up</Link>
    </div>
  );
};

export default SignInPage;
