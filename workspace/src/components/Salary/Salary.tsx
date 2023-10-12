import { useContext } from "react";
import Card from "../../UI/Card/Card";
import { AuthCtx } from "../../contexts/AuthProvider";
import classes from "./Salary.module.css";

const Salary: React.FC = () => {
  const context = useContext(AuthCtx);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  const fromHourNum = +context.from.split(":")[0];
  const fromMinuteNum = +context.from.split(":")[1];
  const toHourNum = +context.to.split(":")[0];
  const toMinuteNum = +context.to.split(":")[1];

  // const calcTimeDiff = (
  //   fromHour: number,
  //   fromMinute: number,
  //   toHour: number,
  //   toMinute: number
  // ) => {
  //   const calcHours = () => {
  //     return toHour - fromHour;
  //   };
  //   const calcMinutes = () => {

  //   };
  //   const hours = calcHours();
  // };

  // const calcTimeDiff = (fromTime: any, toTime: any) => {
  //   const timeDiffMs = toTime - fromTime;
  //   const timeDiffMin = timeDiffMs / 60000;
  //   const timeDiffDecimal = timeDiffMin / 60;
  //   const hours = Math.floor(timeDiffDecimal);
  //   const minutes = Math.floor((timeDiffDecimal - hours) * 60);
  //   const date = new Date();
  //   date.setHours(hours, minutes);
  //   return date;
  // };
  // console.log(calcTimeDiff("15:30", "17:00"));

  return <Card className={classes.container}>Render salary here</Card>;
};

export default Salary;
