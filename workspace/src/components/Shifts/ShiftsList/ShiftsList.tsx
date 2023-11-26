import { useContext, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthCtx } from "../../../contexts/AuthProvider";
import styled from "styled-components";
import { Grid } from "@mui/material";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ShiftsList = styled.ul`
  display: grid;
  padding: 0;
  margin: -10px;
`;

const DeleteShiftButton = styled.button`
  margin: auto;
  margin-bottom: 15px;
  padding: 0px;
  padding-top: 8px;
  background-color: #e3f2fd;

  &:hover {
    background-color: #e3f2fd;
  }
`;

const StyledDeleteIcons = styled(DeleteForeverRoundedIcon)`
  margin-bottom: -5px;
  margin-right: -5px;
  color: #da1e37;

  &:hover {
    color: #854242;
  }
`;

const CardContentDivText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin: 0px;

  label {
    margin: 7px;
  }

  p {
    font-weight: bold;
    margin: 5px;
    color: #263238;
  }

  div {
    border-radius: 12px;
    margin: 5px;
    background-color: #e3f2fd;
    padding: 5px;
  }

  @media (max-width: 320px) {
    div {
      padding: 0px;
    }
  }
`;

const ShiftDetails = styled.div`
  display: flex;
  flex-direction: row;

  div {
    margin-right: 5px;
    margin-top: 5px;
    padding: 5px;
    border: 2px #37474f solid;
    border-radius: 12px;
  }

  label {
    font-size: 14px;
    font-weight: bold;
  }

  p {
    margin: 2px;
    margin-right: 40px;
  }

  @media (max-width: 460px) {
    span,
    label {
      font-size: 12px;
    }
  }

  @media (max-width: 360px) {
    span,
    label {
      font-size: 10px;
    }
  }
`;

const SumDiv = styled.div`
  width: fit-content;
  padding: 5px;
  margin: 10px;
  margin-top: 15px;
  background-color: #e3f2fd;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  p {
    font-weight: bold;
  }

  @media (max-width: 460px) {
    font-size: 12px;
  }

  @media (max-width: 360px) {
    font-size: 10px;
  }
`;

export interface Shift {
  id: string;
  date: Date;
  from: string;
  to: string;
  shiftDuration: string;
}

const ShiftList: React.FC<{
  shifts: Shift[];
  selectedDate: string;
  filteredYear: string;
  filteredMonth: string;
}> = (props) => {
  const context = useContext(AuthCtx);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const formatDateWithMonthLetters = (date: Date) => {
    const dateObject = new Date(date || props.selectedDate);
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      dateObject
    );
    const day = dateObject.getDate().toString().padStart(2, "0");
    const year = dateObject.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const filteredShifts = props.shifts.filter((shift) => {
    const shiftDate = new Date(shift.date);
    const shiftYear = shiftDate.getFullYear().toString();
    const shiftMonth = (shiftDate.getMonth() + 1).toString().padStart(2, "0");

    return (
      shiftYear === props.filteredYear && shiftMonth === props.filteredMonth
    );
  });

  const sortedShifts = filteredShifts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    const dayA = dateA.getDate();
    const dayB = dateB.getDate();

    return dayA - dayB;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShifts = sortedShifts.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteShift = async (shift: any) => {
    if (!context) {
      console.error("No context!");
      return <p>No context!</p>;
    }

    if (!context.email) {
      console.error("No context!");
      return <p>No email!</p>;
    }

    const docRef = doc(context.storeDatabase, "users", context.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const shiftsArray = Object.values(docSnap.data().workingHours);

      const shiftIndex = shiftsArray.findIndex((s: any) => s.id === shift.id);

      if (shiftIndex !== -1) {
        shiftsArray.splice(shiftIndex, 1);

        await updateDoc(docRef, {
          workingHours: shiftsArray,
        });

        context.setList(shiftsArray);
        console.log("Shift deleted successfully.");
      } else {
        console.error(`Shift with ID ${shift.id} not found.`);
      }
    }
  };

  const totalMonthlyHoursInMinutes = filteredShifts.reduce((acc, cur) => {
    const durationParts = cur.shiftDuration.split(":");

    if (durationParts.length === 2) {
      const hours = parseInt(durationParts[0]);
      const minutes = parseInt(durationParts[1]);

      if (!isNaN(hours) && !isNaN(minutes) && minutes < 60) {
        const totalMinutes = hours * 60 + minutes;
        return acc + totalMinutes;
      } else {
        console.error(`Invalid shift duration: ${cur.shiftDuration}`);
        return acc;
      }
    } else {
      console.error(`Invalid shift duration format: ${cur.shiftDuration}`);
      return acc;
    }
  }, 0);

  const totalMonthlyHours = `${String(
    Math.floor(totalMonthlyHoursInMinutes / 60)
  ).padStart(2, "0")}:${String(totalMonthlyHoursInMinutes % 60).padStart(
    2,
    "0"
  )}`;

  const monthlyHours = (hoursType: number) => {
    const totalMinutes = Math.round(hoursType * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  ////////////////////////////////////////////////////////////////
  // extra hours

  const extraMin125Arr: number[] = [];
  const extraMin150Arr: number[] = [];

  const shiftDurationMin = filteredShifts.map((shift: Shift) => {
    const hoursToMinutes = +shift.shiftDuration.split(":")[0] * 60;
    const min = +shift.shiftDuration.split(":")[1];
    const totalMin = hoursToMinutes + min;

    if (totalMin > 480 && totalMin <= 600) {
      const extraMin125 = totalMin - 480;
      extraMin125Arr.push(extraMin125);
    }

    if (totalMin > 600) {
      const extraMin150 = totalMin - 600;
      extraMin125Arr.push(120);
      extraMin150Arr.push(extraMin150);
    }

    return totalMin;
  });

  const extraHours125Arr = extraMin125Arr.map((extra) => {
    return extra / 60;
  });

  const extraHours150Arr = extraMin150Arr.map((extra) => {
    return extra / 60;
  });

  const totalMonthlyExtraHours125 = extraHours125Arr.reduce(
    (acc: number, cur: number) => {
      return acc + cur;
    },
    0
  );

  const totalMonthlyExtraHours150 = +extraHours150Arr
    .reduce((acc: number, cur: number) => {
      return acc + cur;
    }, 0)
    .toFixed(2);

  const totalMonthlyNormalHours = +(
    totalMonthlyHoursInMinutes / 60 -
    totalMonthlyExtraHours125 -
    totalMonthlyExtraHours150
  ).toFixed(2);

  const extraPay125 = context.amountPerHour * 1.25;
  const extraPay150 = context.amountPerHour * 1.5;

  const monthlySalary =
    totalMonthlyNormalHours * context.amountPerHour +
    totalMonthlyExtraHours125 * extraPay125 +
    totalMonthlyExtraHours150 * extraPay150;

  return (
    <MainDiv>
      <SumDiv>
        <p>Total Monthly Hours: {totalMonthlyHours} hours</p>
        <p>
          Total Normal Monthly Hours (100%):{" "}
          {monthlyHours(totalMonthlyNormalHours)} hours
        </p>
        <p>
          Total Monthly Extra Hours (125%):{" "}
          {monthlyHours(totalMonthlyExtraHours125)} hours
        </p>
        <p>
          Total Monthly Extra Hours (150%):{" "}
          {monthlyHours(totalMonthlyExtraHours150)} hours
        </p>
        {context.amountPerHour ? (
          <p>Salary this month: {monthlySalary.toFixed(2)}₪</p>
        ) : (
          <p>No amountPerHour</p>
        )}
      </SumDiv>
      {sortedShifts.length < 1 ? (
        <SumDiv>There are no shifts at this month.</SumDiv>
      ) : (
        currentShifts.map((shift: Shift) => (
          <ShiftsList key={shift.id}>
            <List key={shift.id} sx={{ width: "100%", maxWidth: 360 }}>
              <ListItem
                key={shift.id}
                sx={{
                  border: "2px solid",
                  borderRadius: "12px",
                  backgroundColor: "#e3f2fd",
                }}
              >
                <ListItemText
                  primary={formatDateWithMonthLetters(shift.date)}
                  secondary={
                    <ShiftDetails>
                      <div>
                        <label>From: </label>
                        <span>{shift.from}</span>
                      </div>
                      <div>
                        <label>To: </label>
                        <span>{shift.to}</span>
                      </div>
                      <div>
                        <label>Duration: </label>
                        <span>{shift.shiftDuration}</span>
                      </div>
                    </ShiftDetails>
                  }
                />
                <DeleteShiftButton onClick={() => handleDeleteShift(shift)}>
                  <Grid item>
                    <StyledDeleteIcons />
                  </Grid>
                </DeleteShiftButton>
              </ListItem>
            </List>
          </ShiftsList>
        ))
      )}
      <Stack>
        <Pagination
          count={Math.ceil(sortedShifts.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          showFirstButton
          showLastButton
          color="primary"
        />
      </Stack>
    </MainDiv>
  );
};

export default ShiftList;
