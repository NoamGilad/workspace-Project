import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import classes from "./SignUpUser.module.css";
import CircleLoader from "../../../UI/CircleLoader/CircleLoader";

const SignUpUserPage: React.FC = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();

  if (!context) {
    return <p>No context</p>;
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!context) {
      window.alert("No context!");
      return;
    }

    if (!samePassword) {
      window.alert("Password do not match.");
      return;
    }

    try {
      const registrationSuccess = await context.registerWithEmailAndPassword(
        context.email,
        context.password,
        "Employee",
        context.firstName,
        context.lastName,
        Math.random().toString(),
        context.companyName
      );

      if (registrationSuccess) {
        navigate("/user");
      } else {
        window.alert("Registration problem");
      }
    } catch (error) {
      console.error(error);
      window.alert("Registration problem");
    } finally {
      context.setIsSubmitting(false);
    }
  };

  let samePassword: boolean;

  const handleConfirmPassword = (value: string) => {
    if (value === context.password) {
      samePassword = true;
    } else {
      samePassword = false;
    }
  };

  return (
    <div className={classes.container}>
      <h5>Sign up</h5>
      <form onSubmit={handleSignupSubmit}>
        <main>
          <label>First name</label>
          <input
            type="text"
            onChange={(e) => context.setFirstName(e.target.value)}
            placeholder="Enter your first name"
            required
          />
          <label>Last name</label>
          <input
            type="text"
            onChange={(e) => context.setLastName(e.target.value)}
            placeholder="Enter your last name"
            required
          />
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
          <label>Confirm Password</label>
          <input
            type="password"
            onChange={(e) => handleConfirmPassword(e.target.value)}
            placeholder="Enter your password again"
            required
          />
          <button type="submit" disabled={context.isSubmitting}>
            {context.isSubmitting ? <CircleLoader /> : "Sign up!"}
          </button>
        </main>
      </form>
      <label>Already an account? </label>
      <Link to={"/signin"}>Sign in</Link>
    </div>
  );
};

export default SignUpUserPage;
