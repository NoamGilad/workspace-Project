import { useContext, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthCtx } from "../../../contexts/AuthProvider";
import styled from "styled-components";

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ShiftsList = styled.ul`
  display: grid;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ShiftsListCard = styled.div`
  width: fit-content;
  background-color: #37474f;
  color: black;
  padding: 10px;
  margin: 0px;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  button {
    text-align: center;
    background-color: red;
    color: black;
    margin-bottom: 6px;
    margin-left: 2px;
  }

  button:hover {
    background-color: #854242;
  }

  @media (max-width: 320px) {
    padding: 5px;
  }
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 500px) {
    div {
      label {
        font-size: 13px;
      }

      p {
        font-size: 12px;
      }

      button {
        font-size: 13px;
      }
    }
  }

  @media (max-width: 440px) {
    div {
      label {
        font-size: 11px;
      }

      p {
        font-size: 10px;
      }

      button {
        font-size: 11px;
      }
    }
  }

  @media (max-width: 390px) {
    div {
      margin: -6px;

      label {
        font-size: 10px;
      }

      p {
        font-size: 9px;
      }

      button {
        font-size: 10px;
      }
    }
  }

  @media (max-width: 360px) {
    div {
      margin: -6px;

      label {
        font-size: 9px;
      }

      p {
        font-size: 8px;
      }

      button {
        font-size: 9px;
      }
    }
  }

  @media (max-width: 340px) {
    div {
      margin: -6px;

      label {
        font-size: 8px;
      }

      p {
        font-size: 7px;
      }

      button {
        font-size: 8px;
      }
    }
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

const SumDiv = styled.div`
  width: fit-content;
  padding: 5px;
  margin: 15px;
  background-color: #e3f2fd;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  p {
    font-weight: bold;
  }

  @media (max-width: 340px) {
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

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

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
  console.log(extraMin150Arr);

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

  ////////////////////////////////////////////////////////////////

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
          <p>Salary this month: {monthlySalary}₪</p>
        ) : (
          <p>No amountPerHour</p>
        )}
      </SumDiv>
      {sortedShifts.length < 1 ? (
        <SumDiv>There are no shifts at this month.</SumDiv>
      ) : (
        <ShiftsList>
          {Object.values(filteredShifts).map((shift: any) => (
            <li key={shift.id}>
              <ShiftsListCard>
                <CardContent>
                  <CardContentDivText>
                    <div>
                      <label>Date:</label>
                      <p>{formatDateWithMonthLetters(shift.date)}</p>
                    </div>
                    <div>
                      <label>From:</label>
                      <p>{shift.from}</p>
                    </div>
                    <div>
                      <label>To:</label>
                      <p>{shift.to}</p>
                    </div>
                    <div>
                      <label>Duration:</label>
                      <p>{shift.shiftDuration}</p>
                    </div>
                  </CardContentDivText>
                  <div>
                    <button onClick={() => handleDeleteShift(shift)}>x</button>
                  </div>
                </CardContent>
              </ShiftsListCard>
            </li>
          ))}
        </ShiftsList>
      )}
    </MainDiv>
  );
};

export default ShiftList;
