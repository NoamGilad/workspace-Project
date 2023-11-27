import { useContext } from "react";
import styled from "styled-components";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { AuthCtx } from "../../../contexts/AuthProvider";

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
  }
`;

const ShiftsFilter: React.FC<{
  onChangeFilter: Function;
  selectedYear: any;
  selectedMonth: string;
}> = (props) => {
  const context = useContext(AuthCtx);
  const { t } = useTranslation();

  if (!context) return <h2>No context!</h2>;

  const dropdownChangeHandler = (e: any, name: string) => {
    const { value } = e.target;
    props.onChangeFilter(name, value);
  };

  return (
    <ShiftsFilterContainer>
      <ShiftsFilterControl>
        <FormControl
          variant="outlined"
          sx={{ m: 1, width: 140, color: "#e3f2fd" }}
        >
          <InputLabel id="yearFilter">{t("filterShifts.byYear")}</InputLabel>
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
        <FormControl variant="outlined" sx={{ m: 1, width: 140 }}>
          <InputLabel id="monthFilter">{t("filterShifts.byMonth")}</InputLabel>
          <Select
            sx={{ color: "#e3f2fdc0" }}
            labelId="monthFilter"
            id="monthFilter"
            value={props.selectedMonth}
            onChange={(e: any) => dropdownChangeHandler(e, "selectedMonth")}
            label="Filter by month"
          >
            <MenuItem value="01">{t("filterShifts.jan")}</MenuItem>
            <MenuItem value="02">{t("filterShifts.feb")}</MenuItem>
            <MenuItem value="03">{t("filterShifts.mar")}</MenuItem>
            <MenuItem value="04">{t("filterShifts.apr")}</MenuItem>
            <MenuItem value="05">{t("filterShifts.may")}</MenuItem>
            <MenuItem value="06">{t("filterShifts.jun")}</MenuItem>
            <MenuItem value="07">{t("filterShifts.jul")}</MenuItem>
            <MenuItem value="08">{t("filterShifts.aug")}</MenuItem>
            <MenuItem value="09">{t("filterShifts.sep")}</MenuItem>
            <MenuItem value="10">{t("filterShifts.oct")}</MenuItem>
            <MenuItem value="11">{t("filterShifts.nov")}</MenuItem>
            <MenuItem value="12">{t("filterShifts.dec")}</MenuItem>
          </Select>
        </FormControl>
      </ShiftsFilterControl>
    </ShiftsFilterContainer>
  );
};

export default ShiftsFilter;
