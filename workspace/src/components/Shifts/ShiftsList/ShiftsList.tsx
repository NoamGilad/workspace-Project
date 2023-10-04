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
}

const ShiftList: React.FC<{
  shifts: Shift[];
  selectedDate: string;
  filteredYear: string;
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
    return shiftYear === props.filteredYear;
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
      {filteredShifts.length < 1 ? (
        <p>No shifts this year.</p>
      ) : (
        <ul className={classes.shiftsList}>
          {Object.values(filteredShifts).map((shift: any) => (
            <li key={shift.id}>
              <Card className={classes.shiftsListCard}>
                <div className={classes.cardContent}>
                  <div className={classes.cardContentDivText}>
                    Date: {formatDateWithMonthLetters(shift.date)} From:{" "}
                    {shift.from} To: {shift.to}
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
