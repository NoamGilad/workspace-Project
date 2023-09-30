import { useState } from "react";

const WorkingHoursForm: React.FC<{ addEntryMainForm: Function }> = (props) => {
  const [date, setDate] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

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
    const shift = {
      date: date,
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
      <form onSubmit={handleSubmitAddShift}>
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={handleDateChanger}
            placeholder="Select a date."
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
    </div>
  );
};

export default WorkingHoursForm;
