import { useEffect, useState } from "react";
import { Chart, CategoryScale, LinearScale, Legend } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import { useContext } from "react";
import { AuthCtx, User } from "../../../contexts/AuthProvider";
import { Shift } from "../../Shifts/ShiftsList/ShiftsList";
import { useTranslation } from "react-i18next";
import ShiftsFilter from "../../Shifts/ShiftsFilter/ShiftsFilter";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import CircleLoader from "../../../UI/CircleLoader/CircleLoader";
import { useNavigation } from "react-router-dom";

Chart.register(CategoryScale, LinearScale, Legend);

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  height: 450px;
  padding: 15px;
  padding-bottom: 100px;
  margin: 30px auto;
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
  const { t } = useTranslation();
  const navigation = useNavigation();

  const currentMonth = new Date().toLocaleString("en-US", { month: "2-digit" });
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<string>(props.selectedYear);

  const [chartData, setChartData] = useState<number[] | null>(null);

  useEffect(() => {
    if (!context) {
      return;
    } else {
      const getUsers = async () => {
        const querySnapshot = await getDocs(
          collection(context.storeDatabase, "users")
        );
        const users: any[] = [];
        querySnapshot.forEach((doc) => {
          const userData = {
            id: doc.id,
            ...doc.data(),
          };
          users.push(userData);
        });

        context.setUsersList(users);
      };
      getUsers();
    }

    const fetchData = async () => {
      try {
        const result = await Promise.all(
          usersEmails.map(
            async (email) => await calculateWorkingHoursByMonth(email)
          )
        );
        setChartData(result.map(Number));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [context, selectedMonth, selectedYear]);

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

  const calculateWorkingHoursByMonth = async (userEmail: string) => {
    try {
      const docRef = doc(context.storeDatabase, "users", userEmail);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userHours = docSnap.data().workingHours || [];

        const monthIndex = parseInt(selectedMonth, 10);

        const filteredShifts = userHours.filter((shift: Shift | null) => {
          if (shift === null) return;

          const shiftYear = new Date(shift.date).getFullYear().toString();
          const shiftMonth = new Date(shift.date).getMonth() + 1;
          return shiftYear === selectedYear && shiftMonth === monthIndex;
        });

        const totalMonthlyMinutes = filteredShifts
          .map((shift: Shift | null) => {
            if (shift === null) return;

            const [hours, minutes] = shift.shiftDuration.split(":").map(Number);

            return hours * 60 + minutes;
          })
          .reduce((acc: number | undefined, cur: number | null | undefined) => {
            if (acc === null || cur === null) return acc;
            if (acc === undefined) return cur;
            if (cur === undefined) return acc;

            return acc + cur;
          }, 0);

        if (!totalMonthlyMinutes) {
          console.error("No shifts!");
          return;
        }
        const totalHours = totalMonthlyMinutes / 60;

        return totalHours.toFixed(2);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const labels = context.usersList
    .filter(
      (user) =>
        user.role === "Employee" && user.company.id === context.company.id
    )
    .map((user) => context.nameToCapital(user.firstName, user.lastName));

  const usersEmails = context.usersList
    .filter(
      (user: User) =>
        user.role === "Employee" && user.company.id === context.company.id
    )
    .map((user: User) => {
      return user.id;
    });

  const data = {
    labels: labels,
    datasets: [
      {
        label: `${t("workingChart.title")}`,
        data: chartData,
        backgroundColor: "#e3f2fd",
        barPercentage: 0.2,
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
      {chartData === null ? (
        <CircleLoader />
      ) : (
        <>
          <ShiftsFilter
            onChangeFilter={filterChangeHandler}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
          />
          <Bar data={data} options={options} />
        </>
      )}
    </ChartWrapper>
  );
};

export default AdminChart;
