import { useContext, useEffect } from "react";
import { AuthCtx } from "../contexts/AuthProvider";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: lightsalmon;
  text-align: center;

  & h1 {
    font-size: 100px;
    color: #333;
    margin-top: 20px;
    margin-bottom: 100px;
  }

  @media (max-width: 500px) {
    & h1 {
      font-size: 70px;
    }
  }

  @media (max-width: 350px) {
    & h1 {
      font-size: 50px;
    }
  }
`;

const HomeCard = styled.div`
  max-width: 65%;
  max-height: 100%;
  overflow: hidden;
  background-color: rgb(255, 255, 255);
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  & p {
    display: flex;
    flex-direction: column;
    font-size: 25px;
    margin: 3px;
    box-sizing: border-box;
    max-width: 100%;
    white-space: normal;
  }
`;

const HomePage = () => {
  const context = useContext(AuthCtx);

  useEffect(() => {
    console.log("isSubmitting changed to:", context?.isSubmitting);
    console.log("isLoggedIn changed to:", context?.loggedIn);

    // Rest of your useEffect logic
  }, [context?.isSubmitting, context?.loggedIn]);

  return (
    <Container>
      <h1>WorkEase</h1>
      <HomeCard>
        <p>
          Welcome to WorkEase, the user-friendly workspace platform designed to
          streamline collaboration between employers and employees.
        </p>
        <p>
          Our simple and effective features cater to the essential needs of both
          roles, making work organization a breeze.
        </p>
      </HomeCard>
    </Container>
  );
};

export default HomePage;
