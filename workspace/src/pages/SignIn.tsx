import { Link, useNavigate, useNavigation } from "react-router-dom";
import { AuthCtx } from "../contexts/AuthProvider";
import { FormEvent, useCallback, useContext } from "react";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const SignInPage = () => {
  const context = useContext(AuthCtx);
  const navigation = useNavigation();
  const navigate = useNavigate();

  const isSubmitting = navigation.state === "submitting";

  // const handleLogin = (e: FormEvent) => {
  //   e.preventDefault();

  //   setPersistence(context?.auth, browserSessionPersistence).then(() => {
  //     signInWithEmailAndPassword(
  //       context?.auth,
  //       context?.email,
  //       context?.password
  //     );
  //     navigate("/");
  //   });
  // };

  // const logInWithEmailAndPassword = async (email: any, password: any) => {
  //   try {
  //     setPersistence(context?.auth, browserLocalPersistence).then(() => {
  //       return signInWithEmailAndPassword(context?.auth, email, password);
  //     });

  //     // const userRes = await signInWithEmailAndPassword(
  //     //   context?.auth,
  //     //   email,
  //     //   password
  //     //   );
  //     //   const curUser = userRes.user;

  //     //   console.log(curUser);
  //     navigate("/");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const login = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        await setPersistence(context?.auth, browserSessionPersistence).then(
          () => {
            navigate("/");
            return signInWithEmailAndPassword(
              context?.auth,
              context?.email,
              context?.password
            );
          }
        );
      } catch (error) {
        window.alert(error);
      }
    },
    [context?.email, context?.password]
  );

  // const handleSubmit = (e: FormEvent) => {
  //   e.preventDefault();
  //   login(context?.email, context?.password);
  // };

  return (
    <>
      <h5>Sign in</h5>
      <form onSubmit={login}>
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
