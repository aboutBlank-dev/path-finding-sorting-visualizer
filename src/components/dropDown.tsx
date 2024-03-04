import { useState } from "react";
import "./dropDown.css";

type DropDownProps = {
  id: string;
  label: string;
  options: string[];
  defaultValue: string;
  onChange?: (value: string) => void;
};
export default function DropDown({
  id,
  label,
  options,
  defaultValue,
  onChange,
}: DropDownProps) {
  const onOptionSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (onChange) onChange(value);
  };

  return (
    <div className='dropdown'>
      <span className='label'>{label}</span>
      <select
        className='capitalize input'
        id={id}
        onChange={onOptionSelected}
        defaultValue={defaultValue}
        key={defaultValue}
      >
        {options.map((option) => {
          return (
            <option className='capitalize' key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}
