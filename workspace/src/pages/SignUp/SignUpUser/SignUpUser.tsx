import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { Formik, Field, Form, FormikHelpers } from "formik";
import CircleLoader from "../../../UI/CircleLoader/CircleLoader";
import Container from "../../../UI/StyledContainer";
import { Input } from "../../SignIn/SignIn";

interface Values {
  email: string;
  password: string;
  repassword: string;
  firstName: string;
  lastName: string;
  company: { id: string; name: string };
}

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
  }, [location.search, context]);

  if (!context) {
    return <p>No context</p>;
  }
  //////////////////////////////////////////////////////////////////////////

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

    if (!samePassword) {
      window.alert("Password do not match.");
      return;
    }

    const { companyName, companyId } = getQueryParameters();

    try {
      const registrationSuccess = await context.registerWithEmailAndPassword(
        email,
        password,
        "Employee",
        firstName,
        lastName,
        company
      );

      if (registrationSuccess) {
        const userRef = doc(context.storeDatabase, "users", email);

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
          company: { id: "", name: "" },
        }}
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
          handleConfirmPassword(values.password, values.repassword);
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
          <p>
            Company Name:{" "}
            {companyName ? companyName : "Company Name Not Available"}
          </p>
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

export default SignUpUserPage;
