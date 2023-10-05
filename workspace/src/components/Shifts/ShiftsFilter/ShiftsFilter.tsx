import Card from "../../../UI/Card/Card";
import classes from "./ShiftsFilter.module.css";

const ShiftsFilter: React.FC<{
  onChangeFilter: Function;
  selected: any;
}> = (props) => {
  const dropdownChangeHandler = (e: any) => {
    props.onChangeFilter(e.target.value);
  };

  return (
    <Card className={classes.shiftsFilter}>
      <div className={classes.shiftsFilterControl}>
        <label>Filter by year</label>
        <select value={props.selected} onChange={dropdownChangeHandler}>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>
      </div>
    </Card>
  );
};

export default ShiftsFilter;
