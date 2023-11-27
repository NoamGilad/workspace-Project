import { useContext, useState } from "react";
import { AuthCtx } from "../contexts/AuthProvider";
import Modal from "../UI/Modal/Modal";
import {
  ButtonDiv,
  CloseButton,
  ModalContainer,
  StyledInput,
} from "../components/admin/AddUser/AddUser";
import { useTranslation } from "react-i18next";

interface ResetPasswordProps {
  onResetPassword: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
  const context = useContext(AuthCtx);
  const { t } = useTranslation();

  if (!context) {
    console.error("No context!");
    return;
  }

  return (
    <Modal onClose={() => context.setShowResetModal(false)}>
      <ModalContainer $heb={context.curLanguage === "he"}>
        <label>{t("resetModal.label")}</label>
        <StyledInput
          $heb={context.curLanguage === "he"}
          type="email"
          onChange={(e) => context?.setEmail(e.target.value)}
          placeholder={t("resetModal.emailHolder")}
          required
        />
        <ButtonDiv>
          <button onClick={props.onResetPassword}>
            {t("resetModal.resetBtn")}
          </button>
          <CloseButton onClick={() => context.setShowResetModal(false)}>
            {t("resetModal.closeBtn")}
          </CloseButton>
        </ButtonDiv>
      </ModalContainer>
    </Modal>
  );
};

export default ResetPassword;
