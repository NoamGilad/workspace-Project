import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCtx } from "../../contexts/AuthProvider";
import { sendPasswordResetEmail } from "firebase/auth";
import ResetPassword from "../../components/ResetPassword";
import CircleLoader from "../../UI/CircleLoader/CircleLoader";
import Container from "../../UI/StyledContainer";
import styled from "styled-components";

const ResetButton = styled.button`
  background-color: rgb(122, 122, 122);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 10px;

  &:hover {
    background-color: rgb(81, 81, 81);
  }
`;

export const Input = styled.input<{ valid: boolean }>`
  border: 1px solid ${(props) => (props.valid ? "#ccc" : "red")} !important;
  background-color: ${(props) =>
    props.valid ? "white" : "#FFCDD2"} !important;
`;

const SignInPage: React.FC = () => {
  const context = useContext(AuthCtx);

  const navigate = useNavigate();

  if (!context) {
    console.error("No context!");
    return <p>No context</p>;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!context) {
      console.error("No context!");
      return <p>No context</p>;
    }

    try {
      const curRole = await context.login();

      if (context.auth.currentUser === null) return;

      if (curRole === "Employee") {
        navigate("/user");
        return;
      }

      if (curRole === "Employer") {
        navigate("/admin");
        return;
      }
    } catch (error) {
      console.error(error);
      window.alert("Login problem");
    } finally {
      context.setIsSubmitting(false);
    }
  };

  const handleResetPassword = () => {
    if (!context.auth || context.auth === null) {
      console.log("No auth");
      return;
    }
    if (!context.email || context.email === null) {
      console.log("No email");
      window.alert("Please enter your email.");
      return;
    }

    sendPasswordResetEmail(context.auth, context.email)
      .then(() => {
        console.log("Password reset email sent!");
        console.log(context.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error code:`, errorCode, "Errror message:", errorMessage);
      });
  };

  return (
    <Container>
      <h5>Sign in</h5>
      <form onSubmit={handleLoginSubmit}>
        <main>
          <label>Email</label>
          <Input
            type="email"
            onChange={(e) => {
              context.setEmail(e.target.value);
              context.setEmailValid(true);
            }}
            onFocus={() => context.setEmailValid(true)}
            onBlur={() => context.setEmailValid(context.emailCheck)}
            valid={context.emailValid}
            placeholder="Enter your Email"
            required
          />
          <label>Password</label>
          <Input
            type="password"
            onChange={(e) => {
              context.setPassword(e.target.value);
              context.setPasswordValid(true);
            }}
            onFocus={() => context.setPasswordValid(true)}
            onBlur={() => context.setPasswordValid(context.passwordCheck)}
            valid={context.passwordValid}
            placeholder="Enter your password"
            required
          />
          <button type="submit" disabled={context.isSubmitting}>
            {context.isSubmitting ? <CircleLoader /> : "Login"}
          </button>
        </main>
      </form>
      <label>Forgot your password?</label>
      <ResetButton onClick={() => context.setShowResetModal(true)}>
        Reset password
      </ResetButton>
      {context.showResetModal && (
        <ResetPassword onResetPassword={handleResetPassword} />
      )}
    </Container>
  );
};

export default SignInPage;
