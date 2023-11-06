import styled from "styled-components";

const ShiftsFilterContainer = styled.div`
  margin: 5px;
  width: fit-content;
  color: white;
  padding: 10px;
  background-color: rgb(255, 255, 255);
  margin-bottom: -4px;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  & label {
    align-self: center;
    white-space: nowrap;
    font-weight: bolder;
    margin-bottom: 8px;
    margin-right: 94.5px;
  }

  & select {
    width: 150px;
    align-self: center;
    font: inherit;
    padding: 1px;
    font-weight: bold;
    /* border: 3px solid black; */
    border-radius: 12px;
    margin: 0%;
    background-color: peachpuff;
  }
`;

const ShiftsFilterControl = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;

  & div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 25px;
    margin-right: 25px;
  }

  & label {
    margin: auto;
    margin-bottom: 3px;
  }
`;

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
    <ShiftsFilterContainer>
      <ShiftsFilterControl>
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
      </ShiftsFilterControl>
    </ShiftsFilterContainer>
  );
};

export default ShiftsFilter;
