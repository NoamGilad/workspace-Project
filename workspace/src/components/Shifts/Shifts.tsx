import { useContext, useState } from "react";
import WorkingHoursForm from "./WorkingHoursForm/WorkingHoursForm";
import ShiftList from "./ShiftsList/ShiftsList";
import { AuthCtx } from "../../contexts/AuthProvider";
import ShiftsFilter from "./ShiftsFilter/ShiftsFilter";
import styled from "styled-components";

const ShiftsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  background-color: peachpuff;
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
  margin: 5px;
  width: fit-content;
`;

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
      shiftDuration: shiftDuration.padEnd(2, "0"),
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

  return (
    <ShiftsContainer>
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
    </ShiftsContainer>
  );
};

export default Shifts;
