import React, { useState } from "react";
import { Chart, CategoryScale, LinearScale, Legend } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import { useContext } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import { Shift } from "../../Shifts/ShiftsList/ShiftsList";
import { DimensionsCtx } from "../../../contexts/DimensionsProvider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";

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

  const currentMonth = new Date().getMonth().toString();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  const timeStringToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const calculateWorkingHoursByMonth = (
    monthIndex: number,
    selectedYear: string
  ) => {
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

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    context.setSelectedYearChart(e.target.value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
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
        data: labels.map((userName) =>
          calculateWorkingHoursByMonth(
            parseInt(selectedMonth, 10),
            props.selectedYear
          )
        ),
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
      <FormControl sx={{ m: 1, minWidth: 120, color: "#e3f2fd" }}>
        <InputLabel sx={{ color: "#e3f2fd" }} id="selectYear">
          {t("workingChart.yearFilter")}
        </InputLabel>
        <Select
          sx={{ color: "#e3f2fdc0" }}
          labelId="selectYear"
          id="selectYear"
          value={context.selectedYearChart}
          label="Year"
          onChange={(e: any) => handleYearChange(e)}
        >
          <MenuItem value="2023">2023</MenuItem>
          <MenuItem value="2022">2022</MenuItem>
          <MenuItem value="2021">2021</MenuItem>
          <MenuItem value="2020">2020</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120, color: "#e3f2fd" }}>
        <InputLabel sx={{ color: "#e3f2fd" }} id="selectMonth">
          Month
        </InputLabel>
        <Select
          sx={{ color: "#e3f2fdc0" }}
          labelId="selectMonth"
          id="selectMonth"
          value={selectedMonth}
          label="Month"
          onChange={(e: any) => handleMonthChange(e)}
        >
          {/* Add your month options here */}
          <MenuItem value="January">January</MenuItem>
          <MenuItem value="2">February</MenuItem>
          <MenuItem value="2">March</MenuItem>
          <MenuItem value="2">April</MenuItem>
          <MenuItem value="2">May</MenuItem>
          <MenuItem value="2">June</MenuItem>
          <MenuItem value="2">July</MenuItem>
          <MenuItem value="2">August</MenuItem>
          <MenuItem value="2">September</MenuItem>
          <MenuItem value="2">October</MenuItem>
          <MenuItem value="2">November</MenuItem>
          <MenuItem value="December">December</MenuItem>
          {/* Add the rest of the months */}
        </Select>
      </FormControl>
      <Bar data={data} options={options} />
    </ChartWrapper>
  );
};

export default AdminChart;
