import Card from "../../../UI/Card/Card";
import classes from "./ShiftsFilter.module.css";

const ShiftsFilter: React.FC<{
  onChangeFilter: Function;
  selectedYear: any;
  selectedMonth: string;
}> = (props) => {
  const dropdownChangeHandler = (e: any) => {
    const { name, value } = e.target;
    props.onChangeFilter(name, value);
  };

  return (
    <Card className={classes.shiftsFilter}>
      <div className={classes.shiftsFilterControl}>
        <div>
          <label>Filter by year</label>
          <select
            name="selectedYear"
            value={props.selectedYear}
            onChange={dropdownChangeHandler}
          >
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>
        <div>
          <label>Filter by month</label>
          <select
            name="selectedMonth"
            value={props.selectedMonth}
            onChange={dropdownChangeHandler}
          >
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

export default ShiftsFilter;
