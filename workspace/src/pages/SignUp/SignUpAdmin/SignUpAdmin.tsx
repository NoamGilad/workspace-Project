import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import CircleLoader from "../../../UI/CircleLoader/CircleLoader";

import Container from "../../../UI/StyledContainer";
import { Input, ErrP } from "../../../UI/StyledValidation";

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
      window.alert("No context!");
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
        window.alert("Registration problem");
      }
    } catch (error) {
      console.error(error);
      window.alert("Registration problem");
    } finally {
      context.setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <h5>Sign up</h5>
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
            <label>First name</label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="place your first name here"
              type="text"
              $errors={errors.firstName && touched.firstName}
            />
            {errors.firstName && touched.firstName ? (
              <ErrP>{errors.firstName}</ErrP>
            ) : null}
            <label>Last name</label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="place your last name here"
              type="text"
              $errors={errors.lastName && touched.lastName}
            />
            {errors.lastName && touched.lastName ? (
              <ErrP>{errors.lastName}</ErrP>
            ) : null}
            <label>Company name</label>
            <Input
              id="company.name"
              name="company.name"
              placeholder="place company name here"
              type="text"
              $errors={errors.company && touched.company}
            />
            {errors.company && touched.company ? (
              <ErrP>{errors.company.name}</ErrP>
            ) : null}
            <label>Email</label>
            <Input
              id="email"
              name="email"
              placeholder="place your Email here"
              type="email"
              $errors={errors.email && touched.email}
            />
            {errors.email && touched.email ? <ErrP>{errors.email}</ErrP> : null}
            <label>Password</label>
            <Input
              id="password"
              name="password"
              placeholder="place your password here"
              type="password"
              $errors={errors.password && touched.password}
            />
            {errors.password && touched.password ? (
              <ErrP>{errors.password}</ErrP>
            ) : null}
            <label>Confirm Password</label>
            <Input
              id="passwordConfirmation"
              name="passwordConfirmation"
              placeholder="place your password again"
              type="password"
              $errors={
                errors.passwordConfirmation && touched.passwordConfirmation
              }
            />
            {errors.passwordConfirmation && touched.passwordConfirmation ? (
              <ErrP>{errors.passwordConfirmation}</ErrP>
            ) : null}
            <button type="submit" disabled={context.isSubmitting}>
              {context.isSubmitting ? <CircleLoader /> : "Sign up!"}
            </button>
          </Form>
        )}
      </Formik>
      <label>Already an account? </label>
      <Link to={"/signin"}>Sign in</Link>
    </Container>
  );
};

export default SignUpAdminPage;
