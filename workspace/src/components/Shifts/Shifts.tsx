import { useContext, useState } from "react";
import Card from "../../UI/Card/Card";
import WorkingHoursForm from "./WorkingHoursForm/WorkingHoursForm";
import classes from "./Shifts.module.css";
import ShiftList from "./ShiftsList/ShiftsList";
import { AuthCtx } from "../../contexts/AuthProvider";
import ShiftsFilter from "./ShiftsFilter/ShiftsFilter";

const Shifts = () => {
  const context = useContext(AuthCtx);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filteredYear, setFilteredYear] = useState<string>("2023");

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

    setSelectedDate(date);
  };

  const filterChangHandler = (selectedYear: string) => {
    console.log(selectedYear);
    setFilteredYear(selectedYear);
  };

  return (
    <Card className={classes.workingHoursContainer}>
      <WorkingHoursForm addEntryMainForm={addEntryHandler} />
      {!context.list || context.list.length < 1 ? (
        <p>No shifts to render</p>
      ) : (
        <div>
          <ShiftsFilter
            onChangeFilter={filterChangHandler}
            selected={filteredYear}
          />
          <ShiftList
            shifts={context.list}
            selectedDate={selectedDate}
            filteredYear={filteredYear}
          />
        </div>
      )}
    </Card>
  );
};

export default Shifts;
