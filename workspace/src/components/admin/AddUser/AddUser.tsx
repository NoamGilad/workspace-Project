import { sendSignInLinkToEmail } from "firebase/auth";
import { useContext, useState } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import Modal from "../../../UI/Modal/Modal";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

export const ModalContainer = styled.div<{ $heb: boolean }>`
  width: fit-content;
  display: flex;
  flex-direction: column;
  padding: 15px;
  padding-left: 100px;
  padding-right: 100px;
  align-items: center;
  border-radius: 12px;
  background-color: #263238;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
  text-align: ${(props) => (props.$heb ? "end" : "")};

  input {
    width: auto;
  }

  label {
    font-size: 20px;
  }

  @media (max-width: 520px) {
    padding-left: 70px;
    padding-right: 70px;
  }

  @media (max-width: 450px) {
    padding-left: 40px;
    padding-right: 40px;
  }

  @media (max-width: 390px) {
    padding-left: 20px;
    padding-right: 20px;
  }

  @media (max-width: 330px) {
    padding-left: 5px;
    padding-right: 5px;
  }
`;

export const StyledInput = styled.input<{ $heb: boolean }>`
  text-align: ${(props) => (props.$heb ? "end" : "")};
`;

export const ButtonDiv = styled.div`
  width: fit-content;
  margin: 0 auto;
`;

export const CloseButton = styled.button`
  background-color: #da1e37;

  &:hover {
    background-color: #854242;
  }
`;

const AddUser = () => {
  const context = useContext(AuthCtx);
  const { t } = useTranslation();

  const [toEmail, setToEmail] = useState<string>("");

  if (!context) {
    console.error("No context!");
    return <p>No context</p>;
  }

  const handleAddEmployee = (email: string, e: React.FormEvent) => {
    e.preventDefault();

    sendSignInLinkToEmail(context.auth, email, context.actionCodeSettings)
      .then(() => {
        if (email.length < 0) {
          console.error("No email");
          return;
        }

        window.localStorage.setItem("emailForSignIn", email);
        console.log(email);
        context.setShowAddUserModal(false);
        return;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  const closeModal = () => {
    context.setShowAddUserModal(false);
    console.log("clicked", context.showAddUserModal);
  };

  return (
    <Modal onClose={closeModal}>
      <ModalContainer $heb={context.curLanguage === "he"}>
        <form>
          <label>{t("addUserModal.email")}</label>
          <StyledInput
            $heb={context.curLanguage === "he"}
            type="email"
            placeholder={t("addUserModal.emailHolder")}
            onChange={(e) => {
              setToEmail(e.target.value);
            }}
            required
          />
          <ButtonDiv>
            <button
              onClick={(e) => {
                handleAddEmployee(toEmail, e);
              }}
            >
              {t("addUserModal.sendBtn")}
            </button>
            <CloseButton
              onClick={() => {
                context.setShowAddUserModal(false);
              }}
            >
              {t("addUserModal.closeBtn")}
            </CloseButton>
          </ButtonDiv>
        </form>
      </ModalContainer>
    </Modal>
  );
};

export default AddUser;
