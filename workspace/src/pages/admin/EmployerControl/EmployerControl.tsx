import { useContext } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import UsersList from "../../../components/admin/UsersList/UsersList";
import AddUser from "../../../components/admin/AddUser/AddUser";
import Container from "../../../UI/StyledContainer";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const H1 = styled.h1`
  margin: 0px;
`;

const Button = styled.button`
  margin-bottom: 5px;
`;

const EmployeeControlPage: React.FC = () => {
  const context = useContext(AuthCtx);
  const { t } = useTranslation();

  if (!context) return <p>No context</p>;

  const handleShowAddUser = () => {
    context.setShowAddUserModal(true);
  };

  return (
    <Container>
      <div>
        <H1>{context.company.name}</H1>
        <h3>
          {context.firstName} {context.lastName}
        </h3>
      </div>
      {context?.showAddUserModal && context?.isSubmitting === false ? (
        <AddUser />
      ) : (
        <Button
          onClick={() => {
            handleShowAddUser();
          }}
        >
          {t("control.addUserBtn")}
        </Button>
      )}

      <UsersList />
    </Container>
  );
};

export default EmployeeControlPage;
