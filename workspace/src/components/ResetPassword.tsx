import { useContext, useState } from "react";
import { AuthCtx } from "../contexts/AuthProvider";
import Modal from "../UI/Modal/Modal";
import {
  ButtonDiv,
  CloseButton,
  ModalContainer,
} from "../components/admin/AddUser/AddUser";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { Formik, Form, FormikHelpers } from "formik";
import { sendPasswordResetEmail } from "firebase/auth";
import { Input, ErrP } from "../UI/StyledValidation";

interface ResetPasswordProps {
  onResetPassword: (email: string) => void;
}

interface Values {
  email: string;
}

const ResetPassSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const ResetPassword = () => {
  const context = useContext(AuthCtx);
  const { t } = useTranslation();

  if (!context) {
    console.error("No context!");
    return;
  }

  const handleResetPassword = (email: string) => {
    if (!context) {
      console.error("No context!");
      return;
    }

    if (!context.auth) {
      console.error("No auth");
      return;
    }

    sendPasswordResetEmail(context.auth, email)
      .then(() => {
        console.log("Password reset email sent!");
        console.log(context.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error code:`, errorCode, "Error message:", errorMessage);
      });
  };

  return (
    <Modal onClose={() => context.setShowResetModal(false)}>
      <ModalContainer $heb={context.curLanguage === "he"}>
        <label>{t("resetModal.label")}</label>
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={ResetPassSchema}
          onSubmit={(
            values: Values,
            { setSubmitting }: FormikHelpers<Values>
          ) => {
            handleResetPassword(values.email);
            setSubmitting(false);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Input
                $heb={context.curLanguage === "he"}
                id="email"
                type="email"
                name="email"
                placeholder={t("resetModal.emailHolder")}
                $errors={errors.email && touched.email}
              />
              {errors.email && touched.email ? (
                <ErrP>{errors.email}</ErrP>
              ) : null}
              <ButtonDiv>
                <button type="submit">{t("resetModal.resetBtn")}</button>
                <CloseButton
                  type="button"
                  onClick={() => context.setShowResetModal(false)}
                >
                  {t("resetModal.closeBtn")}
                </CloseButton>
              </ButtonDiv>
            </Form>
          )}
        </Formik>
      </ModalContainer>
    </Modal>
  );
};

export default ResetPassword;
