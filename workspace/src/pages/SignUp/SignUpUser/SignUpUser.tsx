import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import CircleLoader from "../../../UI/CircleLoader/CircleLoader";
import Container from "../../../UI/StyledContainer";

const SignUpUserPage: React.FC = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();
  const location = useLocation();

  const getQueryParameters = () => {
    const searchParams = new URLSearchParams(location.search);
    const companyName = searchParams.get("company");
    const companyId = searchParams.get("companyId");
    return { companyName, companyId };
  };

  const { companyName, companyId } = getQueryParameters();

  useEffect(() => {
    if (!context) {
      console.error("No context");
      return;
    }

    if (!context.storeDatabase) {
      console.error("No storeDatabase in context");
      return;
    }

    if (!context.email) {
      console.log("No email");
      return;
    }
  }, [location.search, context]);

  if (!context) {
    return <p>No context</p>;
  }
  //////////////////////////////////////////////////////////////////////////

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!context) {
      window.alert("No context!");
      return;
    }

    if (!samePassword) {
      window.alert("Password do not match.");
      return;
    }

    const { companyName, companyId } = getQueryParameters();

    try {
      const registrationSuccess = await context.registerWithEmailAndPassword(
        context.email,
        context.password,
        "Employee",
        context.firstName,
        context.lastName,
        context.company
      );

      if (registrationSuccess) {
        context.setCompany({
          id: companyId,
          name: companyName,
        });

        const userRef = doc(context.storeDatabase, "users", context.email);

        await updateDoc(userRef, {
          company: { id: companyId, name: companyName },
        });

        navigate("/user");
      } else {
        window.alert("Registration problem");
      }
    } catch (error) {
      console.error(error);
      window.alert("Registration problem");
    } finally {
      context.setIsSubmitting(false);
    }
  };

  //////////////////////////////////////////////////////////////////////////

  let samePassword: boolean;

  const handleConfirmPassword = (value: string) => {
    if (value === context.password) {
      samePassword = true;
    } else {
      samePassword = false;
    }
  };

  return (
    <Container>
      <h5>Sign up</h5>
      <form onSubmit={handleSignupSubmit}>
        <label>First name</label>
        <input
          type="text"
          onChange={(e) => context.setFirstName(e.target.value)}
          placeholder="Enter your first name"
          required
        />
        <label>Last name</label>
        <input
          type="text"
          onChange={(e) => context.setLastName(e.target.value)}
          placeholder="Enter your last name"
          required
        />
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
        <label>Confirm Password</label>
        <input
          type="password"
          onChange={(e) => handleConfirmPassword(e.target.value)}
          placeholder="Enter your password again"
          required
        />
        <p>
          Company Name:{" "}
          {companyName ? companyName : "Company Name Not Available"}
        </p>
        <button type="submit" disabled={context.isSubmitting}>
          {context.isSubmitting ? <CircleLoader /> : "Sign up!"}
        </button>
      </form>
      <label>Already an account? </label>
      <Link to={"/signin"}>Sign in</Link>
    </Container>
  );
};

export default SignUpUserPage;
