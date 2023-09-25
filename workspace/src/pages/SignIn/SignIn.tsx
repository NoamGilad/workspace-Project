import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { AuthCtx } from "../../contexts/AuthProvider";

import classes from "./SignIn.module.css";
import CircleLoader from "../../UI/CircleLoader";

import { sendPasswordResetEmail } from "firebase/auth";
import ResetPassword from "../../components/ResetPassword";
import Modal from "../../UI/Modal";

const SignInPage: React.FC<{ user: any }> = (props) => {
  const context = useContext(AuthCtx);

  const navigate = useNavigate();

  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);

  const openResetPasswordModal = () => {
    setIsResetPasswordModalOpen(true);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
  };

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
      const loginSuccess = await context.login();

      if (loginSuccess) {
        navigate("/");
      } else {
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
    if (!context?.auth || context.auth === null) return;
    if (!context?.email || context.email === null) return;

    sendPasswordResetEmail(context.auth, context.email)
      .then(() => {
        console.log("Password reset email sent!");
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
      <button className={classes.resetButton} onClick={openResetPasswordModal}>
        Reset password
      </button>
      {isResetPasswordModalOpen && (
        <Modal onClose={closeResetPasswordModal}>
          <ResetPassword onResetPassword={handleResetPassword} />
        </Modal>
      )}
      <label>New account? </label>
      <Link to={"/signup"}>Sign up</Link>
    </div>
  );
};

export default SignInPage;
