import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { AuthCtx } from "../../contexts/AuthProvider";
import { useContext } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";

import classes from "./SignUp.module.css";

const SignUpPage: React.FC = () => {
  const context = useContext(AuthCtx);

  const navigation = useNavigation();
  const navigate = useNavigate();

  const isSubmitting = navigation.state === "submitting";

  if (!context) {
    return <div>No context</div>;
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!context) {
      window.alert("No context!");
      return;
    }

    context.registerWithEmailAndPassword(
      context.email,
      context.password,
      context.role,
      context.firstName,
      context.lastName
    );
    navigate("/");
  };

  return (
    <div className={classes.container}>
      <h5>Sign up</h5>
      <form onSubmit={handleSignupSubmit}>
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Sign up!"}
        </button>
      </form>
      <label>Already an account? </label>
      <Link to={"/signin"}>Sign in</Link>
    </div>
  );
};

export default SignUpPage;
