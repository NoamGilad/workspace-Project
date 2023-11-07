import { useContext } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import styled from "styled-components";
import CircleLoader from "../../UI/CircleLoader/CircleLoader";
import UserInfo from "../../components/UserInfo/UserInfo";
import Shifts from "../../components/Shifts/Shifts";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: lightsalmon;
  text-align: center;

  & h1 {
    margin: 0px;
    margin-bottom: 5px;
    font-size: 70px;
  }

  @media (max-width: 850px) {
    & h1 {
      font-size: 50px;
    }
  }

  @media (max-width: 650px) {
    & h1 {
      font-size: 40px;
    }
  }
`;

const Cards = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;

  @media (max-width: 920px) {
    display: flex;
    flex-direction: column;
  }
`;

const EmployeeProfilePage = () => {
  const context = useContext(AuthCtx);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  const isRole = context.role;

  return (
    <Container>
      <h1>
        Welcome {context.nameToCapital(context.firstName, context.lastName)!}
      </h1>
      <div>
        <h2>Company: {context.company.name}</h2>
        <h2>Role: {context.role}</h2>
      </div>
      {isRole ? (
        <Cards>
          <UserInfo />
          <Shifts />
        </Cards>
      ) : (
        <div>
          <CircleLoader />
        </div>
      )}
    </Container>
  );
};

export default EmployeeProfilePage;
