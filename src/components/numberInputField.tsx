import { useState } from "react";
import "./numberInputField.css";
type NumberInputFieldProps = {
  value: number;
  label: string;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
};
export default function NumberInputField({
  min = 1,
  max = 100,
  value,
  label,
  onChange,
}: NumberInputFieldProps) {
  const [inputValue, setInputValue] = useState(value);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(Number(e.target.value), min), max);
    setInputValue(value);
    if (onChange) onChange(value);
  };

  return (
    <div className='number-input-field'>
      <span className='label'>{label + `(${min} - ${max})`}</span>
      <input
        type='number'
        onChange={handleChange}
        max={max}
        min={min}
        value={inputValue}
      />
    </div>
  );
}
