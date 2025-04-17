import { InputHTMLAttributes } from "react";
import "./input.css";

export interface InputChangeEvent {
  value?: string;
  name?: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onValueChange?: (e: InputChangeEvent) => void;
}

export const Input = ({ label, name, ...rest }: InputProps) => {
  return (
    <div className="input-container">
      {!!label && <label htmlFor={name}>{label}</label>}
      <input id={name} type="text" {...rest}  />
    </div>
  );
};
