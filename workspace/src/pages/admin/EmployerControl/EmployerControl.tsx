import { useContext } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import UsersList from "../../../components/admin/UsersList/UsersList";
import AddUser from "../../../components/admin/AddUser/AddUser";
import Container from "../../../UI/StyledContainer";
import styled from "styled-components";

const H1 = styled.h1`
  margin: 0px;
`;

const Button = styled.button`
  margin-bottom: 5px;
`;

const EmployeeControlPage: React.FC = () => {
  const context = useContext(AuthCtx);

  if (!context) return <p>No context</p>;

  const handleShowAddUser = () => {
    context.setShowModal(true);
  };

  return (
    <Container>
      <H1>{context.company.name}</H1>
      <h2>Admin control page</h2>
      <h3>
        Employer: {context.firstName} {context.lastName}
      </h3>

      {context?.showModal && context?.isSubmitting === false ? (
        <AddUser />
      ) : (
        <Button
          onClick={() => {
            handleShowAddUser();
          }}
        >
          Add employee
        </Button>
      )}

      <UsersList />
    </Container>
  );
};

export default EmployeeControlPage;
