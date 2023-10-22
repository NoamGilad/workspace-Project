import { useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthCtx } from "../../../contexts/AuthProvider";
import classes from "./ShiftsList.module.css";
import Card from "../../../UI/Card/Card";

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

  return (
    <div>
      {sortedShifts.length < 1 ? (
        <p>There are no shifts at this month.</p>
      ) : (
        <ul className={classes.shiftsList}>
          {Object.values(filteredShifts).map((shift: any) => (
            <li key={shift.id}>
              <Card className={classes.shiftsListCard}>
                <div className={classes.cardContent}>
                  <div className={classes.cardContentDivText}>
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
                  </div>
                  <div>
                    <button onClick={() => handleDeleteShift(shift)}>x</button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShiftList;
