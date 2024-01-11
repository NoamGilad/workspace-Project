import { useTranslation } from "react-i18next";
import Container from "../../UI/StyledContainer";
import MainNavigation from "../../components/Navs/MainNavigation";
import { useEffect } from "react";

const ErrorPage = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = "Error Page";
  }, []);

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
