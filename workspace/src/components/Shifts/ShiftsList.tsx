import { useContext, useState } from "react";
import {
  FieldPath,
  deleteField,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { AuthCtx } from "../../contexts/AuthProvider";

interface Shift {
  id: string;
  date: string;
  from: string;
  to: string;
}

const ShiftList: React.FC<{ shifts: Shift[]; selectedDate: string }> = (
  props
) => {
  const context = useContext(AuthCtx);

  const formatDateWithMonthLetters = (date: string) => {
    const dateObject = new Date(date || props.selectedDate);
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      dateObject
    );
    const day = dateObject.getDate().toString().padStart(2, "0");
    const year = dateObject.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const handleDeleteShift = async (index: number) => {
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

      shiftsArray.splice(index, 1);

      await updateDoc(docRef, {
        workingHours: shiftsArray,
      });

      context.setList(shiftsArray);
      console.log("Shift deleted successfully.");
    }
  };

  return (
    <ul>
      {Object.values(props.shifts).map((shift: any, index: number) => (
        <li key={shift.id}>
          Date: {formatDateWithMonthLetters(shift.date)} From: {shift.from} To:{" "}
          {shift.to}
          <button onClick={() => handleDeleteShift(index)}>x</button>
        </li>
      ))}
    </ul>
  );
};

export default ShiftList;
