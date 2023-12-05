import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import CircleLoader from "../../../UI/CircleLoader/CircleLoader";

import Container from "../../../UI/StyledContainer";
import { Input, ErrP } from "../../../UI/StyledValidation";
import { t } from "i18next";

interface Values {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  company: { id: string; name: string };
}

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  company: Yup.object().shape({
    name: Yup.string().required("Company name is required"),
  }),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .required("No password provided.")
    .min(6, "Password is too short- 6 chars minimum.")
    .matches(/\d/, "Password must contain at least one number."),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords must match"
  ),
});

const SignUpAdminPage: React.FC = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();

  if (!context) {
    return <p>No context</p>;
  }

  const handleSignupSubmit = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    company: { id: string; name: string }
  ) => {
    if (!context) {
      console.error("No context!");
      return;
    }

    try {
      const registrationSuccess = await context.registerWithEmailAndPassword(
        email,
        password,
        "Employer",
        firstName,
        lastName,
        company
      );

      if (registrationSuccess) {
        navigate("/admin");
      } else {
        console.error("Registration problem");
      }
    } catch (error) {
      console.error(error);
      console.error("Registration problem");
    } finally {
      context.setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <h5>{t("signup.title")}</h5>
      <Formik
        initialValues={{
          email: "",
          password: "",
          passwordConfirmation: "",
          firstName: "",
          lastName: "",
          company: { id: Math.random().toString(), name: "" },
        }}
        validationSchema={SignupSchema}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          handleSignupSubmit(
            values.email,
            values.password,
            values.firstName,
            values.lastName,
            values.company
          );

          setSubmitting(false);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <label>{t("signup.firstName")}</label>
            <Input
              id="firstName"
              name="firstName"
              placeholder={t("signup.firstNameHolder")}
              type="text"
              $errors={errors.firstName && touched.firstName}
              $heb={context.curLanguage === "he"}
            />
            {errors.firstName && touched.firstName ? (
              <ErrP>{errors.firstName}</ErrP>
            ) : null}
            <label>{t("signup.lastName")}</label>
            <Input
              id="lastName"
              name="lastName"
              placeholder={t("signup.lastNameHolder")}
              type="text"
              $errors={errors.lastName && touched.lastName}
              $heb={context.curLanguage === "he"}
            />
            {errors.lastName && touched.lastName ? (
              <ErrP>{errors.lastName}</ErrP>
            ) : null}
            <label>{t("signup.company")}</label>
            <Input
              id="company.name"
              name="company.name"
              placeholder={t("signup.companyHolder")}
              type="text"
              $errors={errors.company && touched.company}
              $heb={context.curLanguage === "he"}
            />
            {errors.company && touched.company ? (
              <ErrP>{errors.company.name}</ErrP>
            ) : null}
            <label>{t("signup.email")}</label>
            <Input
              id="email"
              name="email"
              placeholder={t("signup.emailHolder")}
              type="email"
              $errors={errors.email && touched.email}
              $heb={context.curLanguage === "he"}
            />
            {errors.email && touched.email ? <ErrP>{errors.email}</ErrP> : null}
            <label>{t("signup.password")}</label>
            <Input
              id="password"
              name="password"
              placeholder={t("signup.passwordHolder")}
              type="password"
              $errors={errors.password && touched.password}
              $heb={context.curLanguage === "he"}
            />
            {errors.password && touched.password ? (
              <ErrP>{errors.password}</ErrP>
            ) : null}
            <label>{t("signup.passwordConfirm")}</label>
            <Input
              id="passwordConfirmation"
              name="passwordConfirmation"
              placeholder={t("signup.passwordConfirmHolder")}
              type="password"
              $errors={
                errors.passwordConfirmation && touched.passwordConfirmation
              }
              $heb={context.curLanguage === "he"}
            />
            {errors.passwordConfirmation && touched.passwordConfirmation ? (
              <ErrP>{errors.passwordConfirmation}</ErrP>
            ) : null}
            <button type="submit" disabled={context.isSubmitting}>
              {context.isSubmitting ? (
                <CircleLoader />
              ) : (
                `${t("signup.button")}`
              )}
            </button>
          </Form>
        )}
      </Formik>
      <label>{t("signup.alreadyLabel")} </label>
      <Link to={"/signin"}>{t("signup.signinLink")}</Link>
    </Container>
  );
};

export default SignUpAdminPage;
