import { useContext, useState } from "react";
import Card from "../../UI/Card/Card";
import WorkingHoursForm from "./WorkingHoursForm/WorkingHoursForm";
import classes from "./Shifts.module.css";
import ShiftList from "./ShiftsList/ShiftsList";
import { AuthCtx } from "../../contexts/AuthProvider";
import ShiftsFilter from "./ShiftsFilter/ShiftsFilter";
import Salary from "../Salary/Salary";

const Shifts = () => {
  const context = useContext(AuthCtx);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filteredYear, setFilteredYear] = useState<string>("2023");
  const [filteredMonth, setFilteredMonth] = useState<string>("01");

  if (!context) {
    return <p>No context!</p>;
  }

  const addEntryHandler = (
    date: string,
    from: string,
    to: string,
    shiftDuration: string
  ) => {
    if (!date || !from || !to || !shiftDuration) {
      console.error("Date, from, to or shiftDuration is missing.");
      return;
    }

    const newShift = {
      date,
      from,
      to,
      shiftDuration,
      id: Math.random().toString(),
    };

    context.setList((prevShiftsList: any) => {
      return [...prevShiftsList, newShift];
    });

    context.storingWorkingHours([...context.list, newShift]);

    setSelectedDate(date);
  };

  const filterChangeHandler = (filterName: string, selectedValue: string) => {
    if (filterName === "selectedYear") {
      setFilteredYear(selectedValue);
    } else if (filterName === "selectedMonth") {
      setFilteredMonth(selectedValue);
    }
  };

  const fromNumber = +context.from;
  const toNumber = +context.to;

  return (
    <Card className={classes.workingHoursContainer}>
      <WorkingHoursForm addEntryMainForm={addEntryHandler} />
      {!context.list || context.list.length < 1 ? (
        <p>No shifts to render</p>
      ) : (
        <div>
          <ShiftsFilter
            onChangeFilter={filterChangeHandler}
            selectedYear={filteredYear}
            selectedMonth={filteredMonth}
          />
          <ShiftList
            shifts={context.list}
            selectedDate={selectedDate}
            filteredYear={filteredYear}
            filteredMonth={filteredMonth}
          />
        </div>
      )}
      <Salary />
    </Card>
  );
};

export default Shifts;
