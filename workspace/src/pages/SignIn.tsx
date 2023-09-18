import { Link, useNavigate, useNavigation } from "react-router-dom";
import { AuthCtx } from "../contexts/AuthProvider";
import { FormEvent, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const SignInPage = () => {
  const context = useContext(AuthCtx);
  const navigation = useNavigation();
  const navigate = useNavigate();

  const isSubmitting = navigation.state === "submitting";

  const logInWithEmailAndPassword = async (email: any, password: any) => {
    try {
      const userRes = await signInWithEmailAndPassword(
        context?.auth,
        email,
        password
      );
      const curUser = userRes.user;

      console.log(curUser);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await logInWithEmailAndPassword(context?.email, context?.password);
  };

  return (
    <>
      <h5>Sign in</h5>
      <form onSubmit={handleSubmit}>
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
