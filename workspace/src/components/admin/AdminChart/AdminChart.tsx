import React, { useState } from "react";
import { Chart, CategoryScale, LinearScale, Legend } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import { useContext } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import { Shift } from "../../Shifts/ShiftsList/ShiftsList";
import { DimensionsCtx } from "../../../contexts/DimensionsProvider";
import { useTranslation } from "react-i18next";
import ShiftsFilter from "../../Shifts/ShiftsFilter/ShiftsFilter";

Chart.register(CategoryScale, LinearScale, Legend);

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  height: 450px;
  padding: 15px;
  padding-bottom: 75px;
  margin: 15px;
  background-color: #263238;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
`;

const AdminChart: React.FC<{
  year: string;
  title: string;
  selectedYear: string;
}> = (props) => {
  const context = useContext(AuthCtx);
  const dimension = useContext(DimensionsCtx);
  const { t } = useTranslation();

  const currentMonth = new Date().toLocaleString("en-US", { month: "2-digit" });
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<string>(props.selectedYear);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  const filterChangeHandler = (filterName: string, selectedValue: string) => {
    if (filterName === "selectedYear") {
      setSelectedYear(selectedValue);
    } else if (filterName === "selectedMonth") {
      setSelectedMonth(selectedValue);
    }
  };

  const timeStringToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const calculateWorkingHoursByMonth = () => {
    const monthIndex = parseInt(selectedMonth, 10);

    const filteredShifts = context.list.filter((shift: Shift) => {
      const shiftYear = new Date(shift.date).getFullYear().toString();
      const shiftMonth = new Date(shift.date).getMonth() + 1;
      return shiftYear === selectedYear && shiftMonth === monthIndex;
    });

    const totalMinutes = filteredShifts.reduce(
      (acc: number, shift: Shift) =>
        acc + timeStringToMinutes(shift.shiftDuration),
      0
    );

    const totalHours = totalMinutes / 60;

    return totalHours.toFixed(2);
  };

  const labels = context.usersList
    .filter(
      (user) =>
        user.role === "Employee" && user.company.id === context.company.id
    )
    .map((user) => context.nameToCapital(user.firstName, user.lastName));

  const data = {
    labels: labels,
    datasets: [
      {
        label: `${t("workingChart.title")}`,
        data: labels.map((userName) => calculateWorkingHoursByMonth()),
        backgroundColor: "#e3f2fd",
        barPercentage: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        text: `${t("workingChart.text")}: ${props.title}`,
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
          text: `${t("workingChart.months")}`,
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
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: `${t("workingChart.hours")}`,
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
      <ShiftsFilter
        onChangeFilter={filterChangeHandler}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />
      <Bar data={data} options={options} />
    </ChartWrapper>
  );
};

export default AdminChart;
