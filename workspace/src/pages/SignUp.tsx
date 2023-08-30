import { createUserWithEmailAndPassword } from "firebase/auth";
import { AuthCtx } from "../contexts/AuthProvider";
import { useContext, useState } from "react";
import { Link, redirect } from "react-router-dom";

const SignUpPage: React.FC = () => {
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

  const onSubmitSignupHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password1)
      .then((userApproval: { user: any }) => {
        const user = userApproval.user;
        console.log(user);
        window.alert("Successfully registered");
        return redirect("/login");
      })
      .catch((error) => {
        const errorMessage = error.message;
        window.alert(errorMessage);
      });
  };

  return (
    <>
      <h1>Sign up</h1>
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
        <label>password</label>
        <input
          type="password"
          onChange={(e) => setPassword1(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit">Sign up!</button>
      </form>
      <label>Already an account?</label>
      <Link to={"/signin"}>Sign in</Link>
    </>
  );
};

export default SignUpPage;
