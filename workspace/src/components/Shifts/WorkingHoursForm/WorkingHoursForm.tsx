import { useState } from "react";

import classes from "./WorkingHoursForm.module.css";

const WorkingHoursForm: React.FC<{ addEntryMainForm: Function }> = (props) => {
  const [date, setDate] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

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
    if (!date || !from || !to) return;

    const shiftDate = new Date(date);

    const shift = {
      date: shiftDate,
      from: from,
      to: to,
    };
    props.addEntryMainForm(date, from, to);

    setDate("");
    setFrom("");
    setTo("");

    return;
  };

  return (
    <div>
      <form className={classes.hoursForm} onSubmit={handleSubmitAddShift}>
        <label>
          Date
          <input
            className={classes.hoursInput}
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
            className={classes.hoursInput}
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
            className={classes.hoursInput}
            type="time"
            value={to}
            onChange={handleToChanger}
            placeholder="Select an hour."
            required
          />
        </label>
        <button type="submit">Add shift</button>
      </form>
    </div>
  );
};

export default WorkingHoursForm;
