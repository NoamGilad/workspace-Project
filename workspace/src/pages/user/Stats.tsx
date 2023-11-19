import { useContext, useState } from "react";
import Container from "../../UI/StyledContainer";
import WorkingHoursChart from "../../components/charts/WorkingHoursChart";
import { AuthCtx } from "../../contexts/AuthProvider";

const StatsPage = () => {
  const context = useContext(AuthCtx);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  const currentYear = new Date().getFullYear().toString();

  return (
    <Container>
      <h1>Stats</h1>
      <WorkingHoursChart
        year={context?.selectedYearChart}
        title={context?.selectedYearChart}
        selectedYear={context?.selectedYearChart}
      />
    </Container>
  );
};

export default StatsPage;
