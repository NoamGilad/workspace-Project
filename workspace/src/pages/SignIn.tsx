import { Link, useNavigate, useNavigation } from "react-router-dom";
import { AuthCtx } from "../contexts/AuthProvider";
import { useContext, useState } from "react";
import { setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const SignInPage = () => {
  const context = useContext(AuthCtx);
  const navigation = useNavigation();
  const storeDataBase = getFirestore();
  const navigate = useNavigate();

  const isSubmitting = navigation.state === "submitting";

  const onSubmitLoginHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (!context) {
      return <div>Loading...</div>;
    }

    if (!context.auth) {
      return <div>No authentication avilable</div>;
    }

    // need to set useEffect on firebase's signin function
    setPersistence(context.auth, { type: "LOCAL" })
      .then(async () => {
        try {
          const userCredential = await signInWithEmailAndPassword(
            context.auth,
            context.email,
            context.password
          );
          const user = userCredential.user;
          console.log(user);

          const userDocRef = doc(storeDataBase, "roles", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const currentUserRole = userData.role;

            context.setCurUserRole(currentUserRole);
          }
        } catch (error: any) {
          const errorMessage = error.message;
          window.alert(errorMessage);
        }
        return navigate("/");
      })
      .catch((error) => {
        console.error("Error enabling persistence:", error);
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
