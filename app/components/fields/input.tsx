import styled from "styled-components";
import { FieldRenderProps } from "react-final-form";

export const Input = styled.input`
  margin: 0 0.2rem;
  padding: 0.1rem;
  border-radius: 3px;
  border: 1px solid #dcdcdc;
  outline: none;
`;

export function InputField(props: FieldRenderProps<string | number>) {
  return (
    <>
      <Input {...props.input} />
      {props.meta.error && 
      <span>{props.meta.error}</span>}
    </>
  );
}
