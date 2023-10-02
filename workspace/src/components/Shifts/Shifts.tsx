import { useContext, useEffect } from "react";
import Card from "../../UI/Card/Card";
import WorkingHoursForm from "./WorkingHoursForm";

import classes from "./Shifts.module.css";
import ShiftList from "./ShiftsList";
import { AuthCtx } from "../../contexts/AuthProvider";

const Shifts = () => {
  const context = useContext(AuthCtx);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  const addEntryHandler = (date: string, from: string, to: string) => {
    if (!date || !from || !to) {
      console.error("Date, from, or to is missing.");
      return;
    }

    const newShift = { date, from, to, id: Math.random().toString() };

    context.setList((prevShiftsList: any) => {
      return [...prevShiftsList, newShift];
    });

    context.storingWorkingHours([...context.list, newShift]);
  };

  return (
    <Card className={classes.workingHoursContainer}>
      <WorkingHoursForm addEntryMainForm={addEntryHandler} />
      {!context.list || context.list.length < 1 ? (
        <p>No shifts to render</p>
      ) : (
        <ShiftList shifts={context.list} />
      )}
    </Card>
  );
};

export default Shifts;
