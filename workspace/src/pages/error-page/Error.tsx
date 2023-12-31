import { useTranslation } from "react-i18next";
import Container from "../../UI/StyledContainer";
import MainNavigation from "../../components/Navs/MainNavigation";

const ErrorPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <MainNavigation />
      <Container>
        <h1>{t("error.title")}</h1>
        <p>{t("error.wrongPage")}</p>
      </Container>
    </>
  );
};

export default ErrorPage;
