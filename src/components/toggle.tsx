import { useState } from "react";
import "./toggle.css";

type ToggleProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function Toggle({ id, label, checked, onChange }: ToggleProps) {
  const [on, setOn] = useState(checked);

  const onStateChange = (on: boolean) => {
    setOn(on);
    onChange(on);
  };

  return (
    <div className='outline-card toggle'>
      <span className='label'>{label}</span>
      <input
        type='checkbox'
        className='checkbox'
        id={id}
        checked={on}
        onChange={(e) => onStateChange(e.target.checked)}
      />
    </div>
  );
}
