import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCtx } from "../../contexts/AuthProvider";
import { sendPasswordResetEmail } from "firebase/auth";
import ResetPassword from "../../components/ResetPassword";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input, ErrP } from "../../UI/StyledValidation";
import CircleLoader from "../../UI/CircleLoader/CircleLoader";
import styled from "styled-components";
import Container from "../../UI/StyledContainer";
import { useTranslation } from "react-i18next";

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

interface Values {
  email: string;
  password: string;
}

const SigninSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .required("No password provided.")
    .min(6, "Password is too short- 6 chars minimum.")
    .matches(/\d/, "Password must contain at least one number."),
});

const SignInPage: React.FC = () => {
  const context = useContext(AuthCtx);
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!context) {
    console.error("No context!");
    return <p>No context</p>;
  }

  const handleLoginSubmit = async (email: string, password: string) => {
    if (!context) {
      console.error("No context!");
      return <p>No context</p>;
    }

    try {
      const curRole = await context.login(email, password);

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
      <h5>{t("signin.title")}</h5>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={SigninSchema}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          handleLoginSubmit(values.email, values.password);
          setSubmitting(false);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <label>{t("signin.email")}</label>
            <Input
              id="email"
              name="email"
              placeholder={t("signin.emailHolder")}
              type="email"
              $errors={errors.email && touched.email}
              $heb={context.curLanguage === "he"}
            />
            {errors.email && touched.email ? <ErrP>{errors.email}</ErrP> : null}
            <label>{t("signin.password")}</label>
            <Input
              id="password"
              name="password"
              placeholder={t("signin.passwordHolder")}
              type="password"
              $errors={errors.password && touched.password}
              $heb={context.curLanguage === "he"}
            />
            {errors.password && touched.password ? (
              <ErrP>{errors.password}</ErrP>
            ) : null}
            <button type="submit" disabled={context.isSubmitting}>
              {context.isSubmitting ? (
                <CircleLoader />
              ) : (
                `${t("signin.button")}`
              )}
            </button>
          </Form>
        )}
      </Formik>
      <label>{t("signin.resetLabel")}</label>
      <ResetButton
        disabled={context.isSubmitting}
        onClick={() => context.setShowResetModal(true)}
      >
        {t("signin.resetButton")}
      </ResetButton>
      {context.showResetModal && (
        <ResetPassword onResetPassword={handleResetPassword} />
      )}
    </Container>
  );
};

export default SignInPage;
