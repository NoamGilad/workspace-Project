import { Bar } from "react-chartjs-2";
import faker from "faker";
import { Chart, CategoryScale, LinearScale } from "chart.js/auto";
import styled from "styled-components";

Chart.register(CategoryScale, LinearScale);

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 40vw;
  height: 40vh;
  margin-left: 15px;
  margin-bottom: 15px;
  align-items: flex-start;
  background-color: #263238;
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
`;

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
  labels: labels,
  datasets: [
    {
      label: "This month",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 300 })),
      backgroundColor: "#e3f2fd",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
  scales: {
    x: {
      type: "category" as const,
      labels: labels,
    },
    y: {
      beginAtZero: true,
    },
  },
};

function WorkingHoursChart() {
  return (
    <ChartWrapper>
      <Bar data={data} options={options} />;
    </ChartWrapper>
  );
}

export default WorkingHoursChart;
