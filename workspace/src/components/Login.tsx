import { Link } from "react-router-dom";

const Login = () => {
  return (
    <form>
      <main>
        <label>Username</label>
        <input type="email" />
        <label>Password</label>
        <input type="password" />
        <button>Login</button>
      </main>
      <label>New account?</label>
      <Link to={"/signup"}>Sign up</Link>
    </form>
  );
};

export default Login;
