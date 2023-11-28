import { Field } from "formik";
import styled from "styled-components";

export const Input = styled(Field)<{ $errors?: boolean }>`
  display: flex;
  flex-direction: column;
  width: auto;
  padding: 10px;
  margin: 0 auto;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: ${(props) => (props.$errors ? "pink" : "#e3f2fd")};
  text-align: ${(props) => (props.$heb ? "end" : "")};
`;

export const ErrP = styled.p`
  color: red;
  margin-top: -10px;
  text-align: center;
`;
