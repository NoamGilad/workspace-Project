import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { AuthCtx } from "../contexts/AuthProvider";
import { useContext } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpPage: React.FC = () => {
  const context = useContext(AuthCtx);

  const navigation = useNavigation();
  const navigate = useNavigate();

  const isSubmitting = navigation.state === "submitting";

  if (!context) {
    return <div>No context</div>;
  }

  const registerWithEmailAndPassword = async (
    name: string,
    email: any,
    password: any
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(
        context?.auth,
        email,
        password
      );
      const user = res.user;
      await addDoc(collection(context?.storeDataBase, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerWithEmailAndPassword(
      "noam",
      context?.email,
      context?.password
    );
  };

  return (
    <>
      <h5>Sign up</h5>
      <form onSubmit={handleSubmit}>
        {/* <label>First name</label>
        <input type="text" placeholder="Enter your first name" />
        <label>Last name</label>
        <input type="text" placeholder="Enter your last name" /> */}
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
      <label>Already an account?</label>
      <Link to={"/signin"}>Sign in</Link>
    </>
  );
};

export default SignUpPage;
