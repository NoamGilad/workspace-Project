import { Bar } from "react-chartjs-2";
import faker from "faker";
import { Chart, CategoryScale, LinearScale, Legend } from "chart.js/auto";
import styled from "styled-components";
import { useContext } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import { Shift } from "../Shifts/ShiftsList/ShiftsList";

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

const WorkingHoursChart: React.FC<{ year: string }> = (props) => {
  const context = useContext(AuthCtx);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  const calculateWorkingHoursByMonth = (monthIndex: number) => {
    const filteredShifts = context.list.filter((shift: Shift) => {
      const shiftYear = new Date(shift.date).getFullYear().toString();
      const shiftMonth = new Date(shift.date).getMonth() + 1;
      return shiftYear === props.year && shiftMonth === monthIndex + 1;
    });

    const totalMinutes = filteredShifts.reduce(
      (acc: number, shift: Shift) =>
        acc + parseInt(shift.shiftDuration.split(":")[1]),
      0
    );

    console.log(Math.floor(totalMinutes / 60));
    return Math.floor(totalMinutes / 60);
  };

  const labels = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Working hours",
        data: labels.map((_, index) => calculateWorkingHoursByMonth(index)),
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
