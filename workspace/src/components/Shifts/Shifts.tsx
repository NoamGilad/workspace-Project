import { useState } from "react";
import Card from "../../UI/Card/Card";
import WorkingHoursForm from "./WorkingHoursForm";

import classes from "./Shifts.module.css";
import ShiftList from "./ShiftsList";

const Shifts = () => {
  const [list, setList] = useState<any>([]);

  const addEntryHandler = (date: string, from: string, to: string) => {
    setList((prevShiftsList: any) => {
      return [
        ...prevShiftsList,
        { date, from, to, id: Math.random().toString() },
      ];
    });
  };

  return (
    <Card className={classes.workingHoursContainer}>
      <WorkingHoursForm addEntryMainForm={addEntryHandler} />
      {!list || list.length < 1 ? (
        <p>No shifts to render</p>
      ) : (
        <ShiftList shifts={list} />
      )}
    </Card>
  );
};

export default Shifts;
