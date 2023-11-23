import styled from "styled-components";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const ShiftsFilterContainer = styled.div`
  margin: 5px;
  width: fit-content;
  color: #e3f2fd;
  margin: auto;
  padding: 10px;
  background-color: #37474f;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  label {
    font-weight: bold;
    margin: auto;
    color: #e3f2fd !important;
  }

  @media (max-width: 390px) {
    margin: 0 auto;
  }
`;

const ShiftsFilterControl = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 25px;
    margin-right: 25px;
  }

  label {
  }

  @media (max-width: 500px) {
    div {
      margin: 0%;
      width: 174px;
    }

    label {
      font-size: 13px;
    }

    select {
      font-size: 13px;
    }
  }

  @media (max-width: 440px) {
    div {
      margin: 0%;
      width: 153px;
    }

    label {
      font-size: 11px;
    }

    select {
      font-size: 11px;
    }
  }

  @media (max-width: 390px) {
    div {
      width: 135.5px;
    }

    label {
      font-size: 10px;
    }

    select {
      font-size: 10px;
      width: 100px;
    }
  }

  @media (max-width: 360px) {
    div {
      width: 125px;
    }

    label {
      font-size: 9px;
    }

    select {
      font-size: 9px;
      width: 100px;
    }
  }

  @media (max-width: 320px) {
    div {
      width: fit-content;

      select {
        width: fit-content;
      }
    }
  }
`;

const ShiftsFilter: React.FC<{
  onChangeFilter: Function;
  selectedYear: any;
  selectedMonth: string;
}> = (props) => {
  const dropdownChangeHandler = (e: any, name: string) => {
    const { value } = e.target;
    props.onChangeFilter(name, value);
  };

  return (
    <ShiftsFilterContainer>
      <ShiftsFilterControl>
        <FormControl
          variant="standard"
          sx={{ m: 1, width: 140, color: "#e3f2fd" }}
        >
          <InputLabel id="yearFilter">Filter by year</InputLabel>
          <Select
            sx={{ color: "#e3f2fdc0" }}
            labelId="yearFilter"
            id="yearFilter"
            value={props.selectedYear}
            label="Filter by year"
            onChange={(e: any) => dropdownChangeHandler(e, "selectedYear")}
          >
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2022">2022</MenuItem>
            <MenuItem value="2021">2021</MenuItem>
            <MenuItem value="2020">2020</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, width: 140 }}>
          <InputLabel id="monthFilter">Filter by month</InputLabel>
          <Select
            sx={{ color: "#e3f2fdc0" }}
            labelId="monthFilter"
            id="monthFilter"
            value={props.selectedMonth}
            onChange={(e: any) => dropdownChangeHandler(e, "selectedMonth")}
            label="Filter by month"
          >
            <MenuItem value="01">January</MenuItem>
            <MenuItem value="02">February</MenuItem>
            <MenuItem value="03">March</MenuItem>
            <MenuItem value="04">April</MenuItem>
            <MenuItem value="05">May</MenuItem>
            <MenuItem value="06">June</MenuItem>
            <MenuItem value="07">July</MenuItem>
            <MenuItem value="08">August</MenuItem>
            <MenuItem value="09">September</MenuItem>
            <MenuItem value="10">October</MenuItem>
            <MenuItem value="11">November</MenuItem>
            <MenuItem value="12">December</MenuItem>
          </Select>
        </FormControl>
      </ShiftsFilterControl>
    </ShiftsFilterContainer>
  );
};

export default ShiftsFilter;
