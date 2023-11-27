import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext, useRef } from "react";
import Modal from "../../../UI/Modal/Modal";
import {
  ButtonDiv,
  CloseButton,
  ModalContainer,
  StyledInput,
} from "../../admin/AddUser/AddUser";
import { useTranslation } from "react-i18next";

const EditUser: React.FC<{
  firstName: string;
  lastName: string;
  id: string;
  updateProfileHandler: Function;
}> = (props) => {
  const context = useContext(AuthCtx);
  const { t } = useTranslation();

  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const amountPerHourRef = useRef<HTMLInputElement | null>(null);

  if (!context) {
    console.error("No context");
    return <p>No context</p>;
  }
  const handleFormSubmit = (e: React.FormEvent) => {
    // e.preventDefault();
    const updatedFirstName = firstNameRef.current?.value || "";
    const updatedLastName = lastNameRef.current?.value || "";
    const updatedAmountPerHour = amountPerHourRef.current?.value
      ? +amountPerHourRef.current?.value
      : 30;

    context.setSelectedUser({
      firstName: updatedFirstName,
      lastName: updatedLastName,
      role: "Employee",
      id: props.id,
      amountPerHour: updatedAmountPerHour,
    });

    props.updateProfileHandler(
      e,
      updatedFirstName,
      updatedLastName,
      props.id,
      updatedAmountPerHour
    );
    context.setShowEditUserModal(false);
  };

  return (
    <Modal onClose={() => context.setShowEditUserModal(false)}>
      <ModalContainer $heb={context.curLanguage === "he"}>
        <form onSubmit={handleFormSubmit}>
          <label>{t("editUserModal.firstName")}</label>
          <StyledInput
            $heb={context.curLanguage === "he"}
            type="text"
            ref={firstNameRef}
            defaultValue={props.firstName}
          />
          <label>{t("editUserModal.lastName")}</label>
          <StyledInput
            $heb={context.curLanguage === "he"}
            type="text"
            ref={lastNameRef}
            defaultValue={props.lastName}
          />
          <label>{t("editUserModal.hourlyWage")}</label>
          <StyledInput
            $heb={context.curLanguage === "he"}
            type="number"
            min="30"
            placeholder={t("editUserModal.hourlyWageHolder")}
            ref={amountPerHourRef}
          />
          <ButtonDiv>
            <button type="submit">{t("editUserModal.updateBtn")}</button>
            <CloseButton onClick={() => context.setShowEditUserModal(false)}>
              {t("editUserModal.closeBtn")}
            </CloseButton>
          </ButtonDiv>
        </form>
      </ModalContainer>
    </Modal>
  );
};

export default EditUser;
