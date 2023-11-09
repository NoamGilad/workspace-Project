import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: lightsalmon;
  text-align: center;

  & input {
    display: flex;
    flex-direction: column;
    width: auto;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    background-color: white;
    margin-bottom: 10px;
  }
`;

export default Container;
