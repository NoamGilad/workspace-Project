import { Link, useNavigate, useNavigation } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthCtx } from "../contexts/AuthProvider";
import { useContext, useState } from "react";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const context = useContext(AuthCtx);
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  if (!context) {
    return <div>Loading...</div>;
  }

  const { auth } = context;

  if (!auth) {
    return <div>No authentication avilable</div>;
  }

  const onSubmitLoginHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userApproval: { user: any }) => {
        const user = userApproval.user;
        console.log(user);

        // Store user role in the authentication context

        let userRole;

        if (userRole === "employee") {
          context.setUserRole(userRole);
        }

        return navigate("/");
      })
      .catch((error) => {
        const errorMessage = error.message;
        window.alert(errorMessage);
      });
  };

  return (
    <>
      <h5>Sign in</h5>
      <form onSubmit={onSubmitLoginHandler}>
        <main>
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
