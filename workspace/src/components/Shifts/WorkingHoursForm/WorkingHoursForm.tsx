import { AuthCtx } from "../../../contexts/AuthProvider";
import { useContext, useState } from "react";
import { Formik, Form, Field, FieldProps } from "formik";
import { DimensionsCtx } from "../../../contexts/DimensionsProvider";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const HoursForm = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-content: center;
  background-color: #37474f;
  margin: 5px;
  margin-right: 15px;
  width: fit-content;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  input {
    text-align: center;
  }

  label {
    font-weight: bold;
    color: #e3f2fd !important;
  }

  @media (max-width: 800px) {
    margin: 0 auto;
    margin-bottom: 10px;
    width: 80%;
    padding: 10px;
  }
`;

const SubmitButton = styled.button`
  background-color: orange;

  &:hover {
    background-color: #ffa6006a;
  }

  @media (max-width: 800px) {
    width: fit-content;
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

  const [isSubmitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedFrom, setSelectedFrom] = useState<string | null>("");
  const [selectedTo, setSelectedTo] = useState<string | null>("");

  if (!context) {
    console.error("No context!");
    return <p>No context!</p>;
  }

  if (!dimensions) {
    console.error("No Dimensions!");
    return <p>No Dimensions!</p>;
  }

  const today = new Date().toISOString().split("T")[0];

  const handleSubmitAddShift = async (
    date: string,
    from: string,
    to: string
  ) => {
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

    const formattedDate = dayjs(date).format("YYYY-MM-DD");

    const newShift = {
      date: formattedDate,
      from,
      to,
      shiftDuration: totalShiftTime,
    };

    const docRef = doc(context.storeDatabase, "users", context.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const shiftsArray = Object.values(docSnap.data().workingHours);

      await updateDoc(docRef, {
        workingHours: [...shiftsArray, newShift],
      });

      context.setList([...shiftsArray, newShift]);
      console.log("Shift added successfully.");

      context.storingWorkingHours([...context.list, newShift]);

      setSelectedDate(date);
      setSelectedFrom(from);
      setSelectedTo(to);

      props.addEntryMainForm(date, from, to, totalShiftTime);
    }
  };

  return (
    <HoursForm>
      <Formik
        initialValues={{
          date: "",
          from: "",
          to: "",
        }}
        onSubmit={async (values: Values, { resetForm }) => {
          if (isSubmitting) {
            return;
          }

          setSubmitting(true);

          await handleSubmitAddShift(values.date, values.from, values.to);

          setSelectedDate("");
          setSelectedFrom(null);
          setSelectedTo(null);
        }}
      >
        <Form>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Field name="date">
                {({ form }: FieldProps<Values>) => (
                  <DatePicker
                    label="Pick a date"
                    format="YYYY-MM-DD"
                    defaultValue={dayjs(today)}
                    value={selectedDate ? dayjs(selectedDate) : null}
                    onChange={(e: Dayjs | null) => {
                      setSelectedDate(e?.format("YYYY-MM-DD") || "");
                      form.setFieldValue("date", e?.format("YYYY-MM-DD") || "");
                    }}
                    sx={{ margin: "5px" }}
                  />
                )}
              </Field>
            </LocalizationProvider>
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Field name="from">
                {({ form }: FieldProps<Values>) => (
                  <TimePicker
                    label="From"
                    value={selectedFrom ? dayjs(selectedFrom) : null}
                    onChange={(e: Dayjs | null) => {
                      setSelectedFrom(e?.format("HH:mm") || "");
                      form.setFieldValue("from", e?.format("HH:mm") || "");
                    }}
                    ampm={false}
                    sx={{ margin: "5px" }}
                  />
                )}
              </Field>
            </LocalizationProvider>
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Field name="from">
                {({ form }: FieldProps<Values>) => (
                  <TimePicker
                    label="To"
                    value={selectedTo ? dayjs(selectedTo) : null}
                    onChange={(e: Dayjs | null) => {
                      setSelectedTo(e?.format("HH:mm") || "");
                      form.setFieldValue("to", e?.format("HH:mm") || "");
                    }}
                    ampm={false}
                    sx={{ margin: "5px" }}
                  />
                )}
              </Field>
            </LocalizationProvider>
          </div>
          <SubmitButton type="submit">Add shift</SubmitButton>
        </Form>
      </Formik>
    </HoursForm>
  );
};

export default WorkingHoursForm;
