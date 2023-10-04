import Card from "../../../UI/Card/Card";

const Salary: React.FC<{ calcTimeDiff: Function }> = (props) => {
  props.calcTimeDiff = (fromTime: number, toTime: number) => {
    const timeDiffMs = toTime - fromTime;
    const timeDiffMin = timeDiffMs / 60000;
    const timeDiffDecimal = timeDiffMin / 60;
    const hours = Math.floor(timeDiffDecimal);
    const minutes = Math.floor((timeDiffDecimal - hours) * 60);
    const date = new Date();
    date.setHours(hours, minutes);
    return date;
  };

  return (
    <Card className={null}>
      <label>abc</label>
    </Card>
  );
};

export default Salary;
