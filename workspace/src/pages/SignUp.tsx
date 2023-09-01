import {
  createUserWithEmailAndPassword,
  updateCurrentUser,
} from "firebase/auth";
import { AuthCtx } from "../contexts/AuthProvider";
import { useContext, useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const storeDataBase = getFirestore();

  const context = useContext(AuthCtx);
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  if (!context) {
    return <div>No context</div>;
  }

  const onSubmitSignupHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!context) {
      console.error("No context available");
      return;
    }

    if (!context.auth) {
      console.error("No authentication available");
      return;
    }

    if (role !== "employee" && role !== "employer") {
      window.alert('Role must be: "employee" or "employer"');
      return;
    }

    try {
      // Register the user
      const userCredential = await createUserWithEmailAndPassword(
        context.auth,
        email,
        password
      );

      // Set user role
      context.setUserRole(role);

      const user = userCredential.user;
      const userDocRef = doc(storeDataBase, "roles", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        role: role,
      });

      window.alert("Successfully registered");
      navigate("/");
    } catch (error: any) {
      const errorMessage = error.message;
      window.alert(errorMessage);
    }

    context.onSubmitionSignupHandler(e);
  };

  return (
    <>
      <h5>Sign up</h5>
      <form onSubmit={onSubmitSignupHandler}>
        {/* <label>First name</label>
        <input type="text" placeholder="Enter your first name" />
        <label>Last name</label>
        <input type="text" placeholder="Enter your last name" /> */}
        <label>Email</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your Email"
          required
        />
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <label>Role</label>
        <input
          type="text"
          onChange={(e: any) => setRole(e.target.value)}
          placeholder="Enter your role"
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Sign up!"}
        </button>
      </form>
      <label>Already an account?</label>
      <Link to={"/signin"}>Sign in</Link>
    </>
  );
};

export default SignUpPage;
