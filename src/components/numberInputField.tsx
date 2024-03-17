import { useState } from "react";
import "./numberInputField.css";

type NumberInputFieldProps = {
  value: number;
  label: string;
  min?: number;
  max?: number;
  id?: string;
  onChange?: (value: number) => void;
};

export default function NumberInputField({
  min = 1,
  max = 100,
  value,
  label,
  id,
  onChange,
}: NumberInputFieldProps) {
  const [inputValue, setInputValue] = useState(value);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(Number(e.target.value), min), max);
    setInputValue(value);
    if (onChange) onChange(value);
  };

  return (
    <div className='outline-card number-input-field'>
      <span className='number-input-label'>{label + ` (${min} - ${max})`}</span>
      <input
        className='number-input-input'
        type='number'
        id={id}
        onChange={handleChange}
        max={max}
        min={min}
        value={inputValue}
      />
    </div>
  );
}
