import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext } from "react";
import { Formik, Form, Field } from "formik";
import { DimensionsCtx } from "../../../contexts/DimensionsProvider";
import styled from "styled-components";

const HoursForm = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #37474f;
  margin: 5px;
  margin-right: 15px;
  width: fit-content;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  input {
    margin-right: 10px;
    margin-left: -12px;
    background-color: #e3f2fd;
    border-radius: 12px;
    text-align: center;
  }

  label {
    font-weight: bold;
    color: #e3f2fd !important;
  }

  @media (max-width: 700px) {
    margin: 0 auto;
    margin-bottom: 10px;
    width: 80%;
    padding: 10px;

    input {
      width: 90%;
      margin: 0 auto;
      padding: 5px;
    }

    button {
      width: 90%;
    }
  }
`;

interface Values {
  date: string;
  from: string;
  to: string;
}

const WorkingHoursForm: React.FC<{ addEntryMainForm: Function }> = (props) => {
  const context = useContext(AuthCtx);
  const dimensions = useContext(DimensionsCtx);

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  if (!dimensions) {
    console.error("No Dimensions!");
    return <p>No Dimensions!</p>;
  }

  const today = new Date().toISOString().split("T")[0];

  const handleSubmitAddShift = (date: string, from: string, to: string) => {
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

    if (!date || !from || !to) return;

    const shiftDate = new Date(date);

    const shift = {
      date: shiftDate,
      from: from,
      to: to,
      totalShiftTime,
    };
    props.addEntryMainForm(date, from, to, totalShiftTime);
    return;
  };

  return (
    <HoursForm>
      <Formik
        initialValues={{
          date: "",
          from: "",
          to: "",
        }}
        onSubmit={(values: Values, { setSubmitting, resetForm }) => {
          handleSubmitAddShift(values.date, values.from, values.to);
          setSubmitting(false);
          resetForm();
        }}
      >
        <Form>
          <label>
            Date
            <Field
              id="date"
              name="date"
              placeholder="Select a date"
              type="date"
              max={today}
            />
          </label>
          <label>
            From
            <Field type="time" name="from" placeholder="Select an hour" />
          </label>
          <label>
            To
            <Field type="time" name="to" placeholder="Select an hour" />
          </label>
          <button type="submit">Add shift</button>
        </Form>
      </Formik>
    </HoursForm>
  );
};

export default WorkingHoursForm;
