import { useEffect, useState } from "react";
import "./stepSlider.css";

type StepSliderProps = {
  max: number;
  onChange: (value: number) => void;
};

let cancel = false;
export default function StepSlider({ max, onChange }: StepSliderProps) {
  const intervalMS = 100;
  const [activeStepIndex, setActiveStepIndex] = useState(max);
  const [playing, setPlaying] = useState(false);

  if (playing) {
    setTimeout(() => {
      if (cancel) return;
      if (activeStepIndex < max) {
        setActiveStepIndex(activeStepIndex + 1);
        onChange(activeStepIndex + 1);
      } else {
        setPlaying(false);
      }
    }, intervalMS);
  }

  const togglePlaying = () => {
    cancel = playing;
    setPlaying(!playing);
  };

  //reset active step index when max changes
  useEffect(() => {
    setActiveStepIndex(0);
    onChange(0);
  }, [max]);

  const playSVG = (
    <svg
      className='play-button'
      onClick={() => togglePlaying()}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polygon points='5 3 19 12 5 21 5 3'></polygon>
    </svg>
  );

  const pauseSVG = (
    <svg
      className='play-button'
      onClick={() => togglePlaying()}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x='6' y='4' width='4' height='16'></rect>
      <rect x='14' y='4' width='4' height='16'></rect>
    </svg>
  );

  return (
    <div className='step-slider'>
      {/* <button className='play-button' onClick={() => togglePlaying()}></button> */}
      {playing ? pauseSVG : playSVG}
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
          cancel = true;
        }}
      />
    </div>
  );
}
