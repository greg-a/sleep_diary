import { InputHTMLAttributes } from "react";
import "./input.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, name, ...rest }: Props) => {
  return (
    <div className="input-container">
      {!!label && <label htmlFor={name}>{label}</label>}
      <input id={name} type="text" {...rest}  />
    </div>
  );
};
