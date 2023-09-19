import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { AuthCtx } from "../contexts/AuthProvider";
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

  const registerWithEmailAndPassword = async (
    email: string,
    password: string,
    role: string,
    firstName: string,
    lastName: string
  ) => {
    if (role !== "employee" && role !== "employer") {
      window.alert("Role must be employee OR employer");
      return;
    }

    try {
      await createUserWithEmailAndPassword(context?.auth, email, password);

      await setDoc(doc(context.storeDataBase, "users", email), {
        email,
        password,
        role,
        firstName,
        lastName,
      });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerWithEmailAndPassword(
      context?.email,
      context?.password,
      context?.role,
      context?.firstName,
      context?.lastName
    );
  };

  return (
    <div className={classes.container}>
      <h5>Sign up</h5>
      <form onSubmit={handleSubmit}>
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
        <input
          type="text"
          onChange={(e: any) => context.setRole(e.target.value)}
          placeholder="Enter your role"
          required
        />
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
