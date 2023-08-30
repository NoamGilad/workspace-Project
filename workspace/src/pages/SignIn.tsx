import { Link, redirect } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthCtx } from "../contexts/AuthProvider";
import { useContext, useState } from "react";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");

  const context = useContext(AuthCtx);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { auth } = context;

  if (!auth) {
    return <div>No authentication avilable</div>;
  }

  const onSubmitLoginHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    await signInWithEmailAndPassword(auth, email, password1)
      .then((userApproval: { user: any }) => {
        const user = userApproval.user;
        console.log(user);
        window.alert("Successfully logged in!");
        return redirect("/loggedout");
      })
      .catch((error) => {
        const errorMessage = error.message;
        window.alert(errorMessage);
      });
  };

  return (
    <>
      <h1>Sign in</h1>
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
            onChange={(e) => setPassword1(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="submit">Login</button>
        </main>
        <label>New account?</label>
        <Link to={"/signup"}>Sign up</Link>
      </form>
    </>
  );
};

export default SignInPage;
