import { useContext, useEffect } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import styled from "styled-components";
import CircleLoader from "../../UI/CircleLoader/CircleLoader";
import UserInfo from "../../components/UserInfo/UserInfo";
import Shifts from "../../components/Shifts/Shifts";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #37474f;
  text-align: center;
  margin: 0 auto;

  h1 {
    margin: 0px;
    margin-bottom: 5px;
    font-size: 70px;
  }

  p,
  label {
    color: #263238;
  }

  @media (max-width: 850px) {
    h1 {
      font-size: 50px;
    }
  }

  @media (max-width: 650px) {
    h1 {
      font-size: 40px;
    }
  }

  @media (max-width: 360px) {
    h1 {
      font-size: 20px;
    }

    h2 {
      font-size: 15px;
    }
  }
`;

const Cards = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;

  @media (max-width: 1050px) {
    display: flex;
    flex-direction: column;
  }
`;

const EmployeeProfilePage = () => {
  const context = useContext(AuthCtx);
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "My Profile";
  }, []);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  const isRole = context.role;

  return (
    <Container>
      <h1>{context.nameToCapital(context.firstName, context.lastName)!}</h1>
      {isRole ? (
        <>
          <div>
            <h2>{context.company.name}</h2>
            <h2>
              {t("profile.hourlyWage")}: {context.amountPerHour}
            </h2>
          </div>
          <Cards>
            <UserInfo />
            <Shifts />
          </Cards>
        </>
      ) : (
        <CircleLoader />
      )}
    </Container>
  );
};

export default EmployeeProfilePage;
