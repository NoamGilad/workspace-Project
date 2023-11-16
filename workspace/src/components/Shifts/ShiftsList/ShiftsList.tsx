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
  background-color: #263238;
  color: black;
  padding: 10px;
  margin: 0px;
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
    background-color: #263238;
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
  }

  div {
    border-radius: 12px;
    margin: 5px;
    background-color: #263238;
    padding: 5px;
  }

  @media (max-width: 320px) {
    div {
      padding: 0px;
    }
  }
`;

const Sum = styled.p`
  @media (max-width: 340px) {
    font-size: 10px;
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

  return (
    <div>
      <Sum>Total Monthly Hours: {totalMonthlyHours} hours</Sum>
      {context.amountPerHour ? (
        <Sum>
          Salary this month:{" "}
          {Math.floor(
            (totalMonthlyHoursInMinutes / 60) * context.amountPerHour
          )}
          ₪
        </Sum>
      ) : (
        <Sum>No amountPerHour</Sum>
      )}
      {sortedShifts.length < 1 ? (
        <Sum>There are no shifts at this month.</Sum>
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
