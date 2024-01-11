import { useContext, useEffect, useState } from "react";
import Container from "../../UI/StyledContainer";
import WorkingHoursChart from "../../components/charts/WorkingHoursChart";
import { AuthCtx } from "../../contexts/AuthProvider";
import { useTranslation } from "react-i18next";

const StatsPage = () => {
  const context = useContext(AuthCtx);
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "My Stats";
  }, []);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  return (
    <Container>
      <h1>{t("stats.title")}</h1>
      <WorkingHoursChart
        year={context?.selectedYearChart}
        title={context?.selectedYearChart}
        selectedYear={context?.selectedYearChart}
      />
    </Container>
  );
};

export default StatsPage;
