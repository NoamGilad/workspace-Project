import { Bar } from "react-chartjs-2";
import faker from "faker";
import { Chart, CategoryScale, LinearScale, Legend } from "chart.js/auto";
import styled from "styled-components";

Chart.register(CategoryScale, LinearScale, Legend);

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  background-color: #263238;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
`;

const WorkingHoursChart: React.FC<{ workingHoursData: any }> = (props) => {
  const labels = props.workingHoursData.map((entry: any) => entry.date);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Working hours",
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
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Working hours by month",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#e3f2fd",
      },
    },
    scales: {
      x: {
        type: "category" as const,
        labels: labels,
        title: {
          display: true,
          text: "Months",
          font: {
            size: 16,
          },
          color: "#e3f2fd",
        },
        ticks: {
          color: "#e3f2fd",
        },
        grid: {
          display: false,
        },
        barPercentage: 0.8,
        categoryPercentage: 0.8,
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hours",
          font: {
            size: 16,
          },
          color: "#e3f2fd",
        },
        ticks: {
          color: "#e3f2fd",
        },
        grid: {
          color: "#e3f2fd",
        },
      },
    },
  };

  return (
    <ChartWrapper>
      <Bar data={data} options={options} />;
    </ChartWrapper>
  );
};

export default WorkingHoursChart;
