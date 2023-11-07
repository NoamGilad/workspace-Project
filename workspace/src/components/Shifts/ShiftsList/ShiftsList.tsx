import { useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthCtx } from "../../../contexts/AuthProvider";
import styled from "styled-components";

const ShiftsList = styled.ul`
  display: grid;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ShiftsListCard = styled.div`
  width: fit-content;
  background-color: rgb(255, 255, 255);
  color: black;
  padding: 10px;
  margin: 5px;
  margin-bottom: -15px;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  & button {
    text-align: center;
    background-color: red;
    color: black;
    margin-bottom: 6px;
    margin-left: 2px;
  }

  & button:hover {
    background-color: lightcoral;
  }
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardContentDivText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  & label {
    margin: 7px;
  }

  & p {
    font-weight: bold;
    margin: 5px;
  }

  & div {
    border-radius: 12px;
    margin: 5px;
    background-color: peachpuff;
    padding: 5px;
  }
`;

interface Shift {
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

  console.log(totalMonthlyHoursInMinutes);
  console.log(totalMonthlyHours);

  return (
    <div>
      <p>Total Monthly Hours: {totalMonthlyHours} hours</p>
      {context.amount ? (
        <p>
          Salary this month:{" "}
          {Math.floor((totalMonthlyHoursInMinutes / 60) * context.amount)}₪
        </p>
      ) : (
        <p>No amountPerHour</p>
      )}
      {sortedShifts.length < 1 ? (
        <p>There are no shifts at this month.</p>
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
    </div>
  );
};

export default ShiftList;
