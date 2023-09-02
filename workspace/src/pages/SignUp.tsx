import { AuthCtx } from "../contexts/AuthProvider";
import { useContext } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const context = useContext(AuthCtx);

  const navigation = useNavigation();
  const navigate = useNavigate();

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

    if (context.role !== "employee" && context.role !== "employer") {
      window.alert('Role must be: "employee" or "employer"');
      return;
    }

    context.onSubmitionSignupHandler(e);
    window.alert("Successfully registered");
    navigate("/");
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
