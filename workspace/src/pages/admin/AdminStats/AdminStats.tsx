import { useContext } from "react";
import AdminChart from "../../../components/admin/AdminChart/AdminChart";
import { AuthCtx } from "../../../contexts/AuthProvider";
import { useTranslation } from "react-i18next";

const AdminStatsPage = () => {
  const context = useContext(AuthCtx);
  const { t } = useTranslation();

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  return (
    <AdminChart
      year={context?.selectedYearChart}
      title="Working Hours Chart"
      selectedYear={context?.selectedYearChart}
    />
  );
};

export default AdminStatsPage;
