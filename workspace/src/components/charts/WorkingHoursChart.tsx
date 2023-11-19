import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, Legend } from "chart.js/auto";
import styled from "styled-components";
import { useContext, useState } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import { Shift } from "../Shifts/ShiftsList/ShiftsList";

Chart.register(CategoryScale, LinearScale, Legend);

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  padding: 15px;
  margin: 15px;
  background-color: #263238;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  @media (max-width: 700px) {
    width: 60vw;
  }
`;

const SelectYear = styled.select`
  width: fit-content;
  text-align: center;
`;

const WorkingHoursChart: React.FC<{
  year: string;
  title: string;
  selectedYear: string;
}> = (props) => {
  const context = useContext(AuthCtx);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  const timeStringToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const calculateWorkingHoursByMonth = (monthIndex: number) => {
    const filteredShifts = context.list.filter((shift: Shift) => {
      const shiftYear = new Date(shift.date).getFullYear().toString();
      const shiftMonth = new Date(shift.date).getMonth() + 1;
      return shiftYear === props.year && shiftMonth === monthIndex + 1;
    });

    const totalMinutes = filteredShifts.reduce(
      (acc: number, shift: Shift) =>
        acc + timeStringToMinutes(shift.shiftDuration),
      0
    );

    const totalHours = totalMinutes / 60;

    return totalHours.toFixed(2);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    context.setSelectedYearChart(e.target.value);
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
        text: `Working hours by month: ${props.title}`,
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
      <SelectYear
        name="selectedYear"
        value={props.selectedYear}
        onChange={handleYearChange}
      >
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
      </SelectYear>
      <Bar data={data} options={options} />
    </ChartWrapper>
  );
};

export default WorkingHoursChart;
