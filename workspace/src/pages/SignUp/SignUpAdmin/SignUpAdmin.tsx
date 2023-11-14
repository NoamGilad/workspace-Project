import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, FormikHelpers } from "formik";
import CircleLoader from "../../../UI/CircleLoader/CircleLoader";

import Container from "../../../UI/StyledContainer";

interface Values {
  email: string;
  password: string;
  repassword: string;
  firstName: string;
  lastName: string;
  company: { id: string; name: string };
}

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

  let samePassword: boolean;

  const handleConfirmPassword = (password: string, repassword: string) => {
    if (password === repassword) {
      samePassword = true;
    } else {
      samePassword = false;
    }
  };

  return (
    <Container>
      <h5>Sign up</h5>
      <Formik
        initialValues={{
          email: "",
          password: "",
          repassword: "",
          firstName: "",
          lastName: "",
          company: { id: Math.random().toString(), name: "" },
        }}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          handleConfirmPassword(values.password, values.repassword);

          if (samePassword) {
            handleSignupSubmit(
              values.email,
              values.password,
              values.firstName,
              values.lastName,
              values.company
            );
          } else {
            window.alert("Password do not match.");
          }
          setSubmitting(false);
        }}
      >
        <Form>
          <label>First name</label>
          <Field
            id="firstName"
            name="firstName"
            placeholder="place your first name here"
            type="text"
            required
          />
          <label>Last name</label>
          <Field
            id="lastName"
            name="lastName"
            placeholder="place your last name here"
            type="text"
            required
          />
          <label>Company name</label>
          <Field
            id="company.name"
            name="company.name"
            placeholder="place the company name here"
            type="text"
            required
          />
          <label>Email</label>
          <Field
            id="email"
            name="email"
            placeholder="place your Email here"
            type="email"
            required
          />
          <label>Password</label>
          <Field
            id="password"
            name="password"
            placeholder="place your password here"
            type="password"
            required
          />
          <label>Confirm Password</label>
          <Field
            id="repassword"
            name="repassword"
            placeholder="place your password again"
            type="password"
            required
          />
          <button type="submit" disabled={context.isSubmitting}>
            {context.isSubmitting ? <CircleLoader /> : "Sign up!"}
          </button>
        </Form>
      </Formik>
      <label>Already an account? </label>
      <Link to={"/signin"}>Sign in</Link>
    </Container>
  );
};

export default SignUpAdminPage;
