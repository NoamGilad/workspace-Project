import Container from "../../UI/StyledContainer";
import WorkingHoursChart from "../../components/charts/WorkingHoursChart";

const StatsPage = () => {
  const currentYear = new Date().getFullYear().toString();

  return (
    <Container>
      <h1>Stats</h1>
      <WorkingHoursChart year={currentYear} />
    </Container>
  );
};

export default StatsPage;
