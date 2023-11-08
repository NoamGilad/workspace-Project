import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext } from "react";
import styled from "styled-components";

const HoursForm = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgb(255, 255, 255);
  margin: 5px;
  margin-right: 15px;
  width: fit-content;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  & input {
    margin-right: 10px;
    margin-left: -12px;
    background-color: peachpuff;
    border-radius: 12px;
    text-align: center;
  }

  & label {
    font-weight: bold;
  }

  @media (max-width: 700px) {
    margin: 0 auto;
    margin-bottom: 10px;

    & div {
      display: flex;
      flex-direction: row;
    }

    & input {
      width: 45vw;
      margin: 0 auto;
    }

    & button {
      width: 50vw;
    }
  }
`;

const TimeInputs = styled.div`
  & input {
    width: 20vw;
    margin: 0 auto;
    margin-left: 5px;
    margin-bottom: 5px;
  }

  & label {
    margin-top: 0px;
  }
`;

const WorkingHoursForm: React.FC<{ addEntryMainForm: Function }> = (props) => {
  const context = useContext(AuthCtx);
  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  const { date, setDate, from, setFrom, to, setTo } = context;

  const today = new Date().toISOString().split("T")[0];

  const handleDateChanger = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleFromChanger = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrom(e.target.value);
  };

  const handleToChanger = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTo(e.target.value);
  };

  const handleSubmitAddShift = (e: React.FormEvent) => {
    e.preventDefault();

    const fromDate = new Date(date);
    const fromTime = new Date(`${date}T${from}`);
    const toTime = new Date(`${date}T${to}`);

    const durationMs = toTime.getTime() - fromTime.getTime();

    const hours = String(Math.floor(durationMs / (1000 * 60 * 60))).padStart(
      2,
      "0"
    );
    const minutes = String(
      Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    ).padStart(2, "0");

    const totalShiftTime = `${hours}:${minutes}`;

    console.log("Date:", fromDate);
    console.log("From Time:", fromTime);
    console.log("To Time:", toTime);
    console.log("Duration (hours:minutes):", totalShiftTime);

    if (!date || !from || !to) return;

    const shiftDate = new Date(date);

    const shift = {
      date: shiftDate,
      from: from,
      to: to,
      totalShiftTime,
    };
    props.addEntryMainForm(date, from, to, totalShiftTime);

    setDate("");
    setFrom("");
    setTo("");

    return;
  };

  let content = (
    <HoursForm>
      <form onSubmit={handleSubmitAddShift}>
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={handleDateChanger}
            placeholder="Select a date."
            min="2020-01-01"
            max={today}
            required
          />
        </label>
        <label>
          From
          <input
            type="time"
            value={from}
            onChange={handleFromChanger}
            placeholder="Select an hour."
            required
          />
        </label>
        <label>
          To
          <input
            type="time"
            value={to}
            onChange={handleToChanger}
            placeholder="Select an hour."
            required
          />
        </label>
        <button type="submit">Add shift</button>
      </form>
    </HoursForm>
  );

  if (window.innerWidth < 700) {
    content = (
      <HoursForm>
        <form onSubmit={handleSubmitAddShift}>
          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={handleDateChanger}
              placeholder="Select a date."
              min="2020-01-01"
              max={today}
              required
            />
          </label>
          <TimeInputs>
            <label>
              From
              <input
                type="time"
                value={from}
                onChange={handleFromChanger}
                placeholder="Select an hour."
                required
              />
            </label>
            <label>
              To
              <input
                type="time"
                value={to}
                onChange={handleToChanger}
                placeholder="Select an hour."
                required
              />
            </label>
          </TimeInputs>
          <button type="submit">Add shift</button>
        </form>
      </HoursForm>
    );
  }

  return <>{content}</>;
};

export default WorkingHoursForm;
