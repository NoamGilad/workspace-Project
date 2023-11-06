import Container from "../../UI/StyledContainer";
import MainNavigation from "../../components/MainNavigation/MainNavigation";

const ErrorPage = () => {
  return (
    <>
      <MainNavigation />
      <Container>
        <h1>An error occurred!</h1>
        <p>Could not find this page!</p>
      </Container>
    </>
  );
};

export default ErrorPage;
