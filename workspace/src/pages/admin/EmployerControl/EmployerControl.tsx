import { useContext, useEffect } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import UsersList from "../../../components/admin/UsersList/UsersList";
import AddUser from "../../../components/admin/AddUser/AddUser";
import Container from "../../../UI/StyledContainer";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Calender from "../../../components/admin/Calender/Calender";

const H1 = styled.h1`
  margin: 0px;
`;

const StyledPara = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #e3f2fd;
`;

const Button = styled.button`
  margin-bottom: 5px;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const EmployeeControlPage: React.FC = () => {
  const context = useContext(AuthCtx);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = "Users List";
  }, []);

  if (!context) {
    console.error("No context!");
    return;
  }

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
      <StyledDiv>
        {context?.usersList && context.usersList.length > 0 ? (
          <UsersList />
        ) : (
          <StyledPara>No employee yet, add one now!</StyledPara>
        )}
      </StyledDiv>
    </Container>
  );
};

export default EmployeeControlPage;
