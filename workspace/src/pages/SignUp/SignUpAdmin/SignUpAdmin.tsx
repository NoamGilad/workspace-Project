import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import CircleLoader from "../../../UI/CircleLoader/CircleLoader";

import Container from "../../../UI/StyledContainer";

const SignUpAdminPage: React.FC = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();

  if (!context) {
    return <p>No context</p>;
  }

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

    try {
      const registrationSuccess = await context.registerWithEmailAndPassword(
        context.email,
        context.password,
        "Employer",
        context.firstName,
        context.lastName,
        context.company
      );

      if (registrationSuccess) {
        navigate("/admin");
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
        <label>Company name</label>
        <input
          type="text"
          onChange={(e) =>
            context.setCompany({
              id: Math.random().toString(),
              name: e.target.value,
            })
          }
          placeholder="Enter the company name"
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
        <button type="submit" disabled={context.isSubmitting}>
          {context.isSubmitting ? <CircleLoader /> : "Sign up!"}
        </button>
      </form>
      <label>Already an account? </label>
      <Link to={"/signin"}>Sign in</Link>
    </Container>
  );
};

export default SignUpAdminPage;
