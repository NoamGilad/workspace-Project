import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext } from "react";
import classes from "./WorkingHoursForm.module.css";
import Card from "../../../UI/Card/Card";

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

  return (
    <Card className={classes.hoursForm}>
      <form onSubmit={handleSubmitAddShift}>
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
    </Card>
  );
};

export default WorkingHoursForm;
