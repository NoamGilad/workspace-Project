import { useContext, useState } from "react";
import WorkingHoursForm from "./WorkingHoursForm/WorkingHoursForm";
import ShiftList from "./ShiftsList/ShiftsList";
import { AuthCtx } from "../../contexts/AuthProvider";
import ShiftsFilter from "./ShiftsFilter/ShiftsFilter";
import styled from "styled-components";

const ShiftsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: fit-content;
  margin-left: 15px;
  margin-bottom: 15px;
  align-items: flex-start;
  background-color: #263238;
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  p {
    color: #e3f2fd;
  }

  @media (max-width: 940px) {
    margin: 0 auto;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  @media (max-width: 700px) {
    width: min-content;
    flex-direction: column;
  }
`;

const Shifts = () => {
  const context = useContext(AuthCtx);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filteredYear, setFilteredYear] = useState<string>("2023");

  const currentMonth = new Date().toLocaleString("en-US", { month: "2-digit" });
  const [filteredMonth, setFilteredMonth] = useState<string>(currentMonth);

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
      <div>
        <ShiftsFilter
          onChangeFilter={filterChangeHandler}
          selectedYear={filteredYear}
          selectedMonth={filteredMonth}
        />
        {!context.list || context.list.length < 1 ? (
          <p>No shifts to render</p>
        ) : (
          <ShiftList
            shifts={context.list}
            selectedDate={selectedDate}
            filteredYear={filteredYear}
            filteredMonth={filteredMonth}
          />
        )}
      </div>
    </ShiftsContainer>
  );
};

export default Shifts;
