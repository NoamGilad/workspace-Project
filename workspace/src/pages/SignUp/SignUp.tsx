import { AuthCtx } from "../../contexts/AuthProvider";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import classes from "./SignUp.module.css";
import CircleLoader from "../../UI/CircleLoader/CircleLoader";

const SignUpPage: React.FC = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();

  if (!context) {
    return <div>No context</div>;
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!context) {
      window.alert("No context!");
      return;
    }

    try {
      const registrationSuccess = await context.registerWithEmailAndPassword(
        context.email,
        context.password,
        context.role,
        context.firstName,
        context.lastName
      );

      if (registrationSuccess && context.role === "Employee") {
        navigate("/user");
      } else if (registrationSuccess && context.role === "Employer") {
        navigate("/admin");
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
          />{" "}
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
          <label>Role</label>
          <select
            value={context.role}
            onChange={(e) => context.setRole(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Employee">Employee</option>
            <option value="Employer">Employer</option>
          </select>
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

export default SignUpPage;
