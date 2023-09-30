const ShiftList: React.FC<{ shifts: Array<string> }> = (props) => {
  return (
    <ul>
      {props.shifts.map((shift: any) => (
        <li key={shift.id}>
          {shift.date} {shift.from} {shift.to}
        </li>
      ))}
    </ul>
  );
};

export default ShiftList;
