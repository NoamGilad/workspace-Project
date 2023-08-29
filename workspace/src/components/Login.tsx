const Login = () => {
  const signUpHandler = () => {};

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
      <button onClick={signUpHandler}>Sign up</button>
    </form>
  );
};

export default Login;
