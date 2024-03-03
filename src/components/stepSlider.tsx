import { useEffect, useState } from "react";
import "./stepSlider.css";

type StepSliderProps = {
  max: number;
  onChange: (value: number) => void;
};

export default function StepSlider({ max, onChange }: StepSliderProps) {
  const intervalMS = 100;
  const [activeStepIndex, setActiveStepIndex] = useState(max);
  const [playing, setPlaying] = useState(false);

  if (playing) {
    setTimeout(() => {
      if (activeStepIndex < max) {
        setActiveStepIndex(activeStepIndex + 1);
        onChange(activeStepIndex + 1);
      } else {
        setPlaying(false);
      }
    }, intervalMS);
  }

  const togglePlaying = () => {
    setPlaying(!playing);
  };

  //reset active step index when max changes
  useEffect(() => {
    setActiveStepIndex(0);
    onChange(0);
  }, [max]);

  return (
    <div className='step-slider'>
      <button className='play-button' onClick={() => togglePlaying()}></button>
      <input
        type='range'
        className='slider'
        min={0}
        max={max}
        value={activeStepIndex}
        onChange={(e) => {
          setActiveStepIndex(parseInt(e.target.value));
          onChange(parseInt(e.target.value));

          //manually stop playing if user changes the slider
          setPlaying(false);
        }}
      />
    </div>
  );
}
