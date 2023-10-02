import { useContext } from "react";
import { FieldPath, deleteField, doc, updateDoc } from "firebase/firestore";
import { AuthCtx } from "../../contexts/AuthProvider";

interface Shift {
  id: string;
  date: string;
  from: string;
  to: string;
}

const ShiftList: React.FC<{ shifts: Shift[] }> = (props) => {
  const context = useContext(AuthCtx);

  const handleDeleteShift = async (shift: Shift) => {
    if (!context) {
      console.error("No context!");
      return <p>No context!</p>;
    }

    if (!context.email) {
      console.error("No context!");
      return <p>No email!</p>;
    }

    const shiftRef = doc(context.storeDatabase, "users", context.email);

    updateDoc(shiftRef, {
      workingHours: deleteField(),
    });

    console.log(`clicked ${shift.id}`);
  };

  return (
    <ul>
      {props.shifts.map((shift: any) => (
        <li key={shift.id}>
          {shift.date} {shift.from} {shift.to}
          <button onClick={(e) => handleDeleteShift(shift)}>X</button>
        </li>
      ))}
    </ul>
  );
};

export default ShiftList;
