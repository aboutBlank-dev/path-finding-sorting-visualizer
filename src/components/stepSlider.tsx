import { useEffect, useMemo, useState } from "react";
import "./stepSlider.css";

type StepSliderProps = {
  activeStepIndex: number;
  max: number;
  playbackTimeS: number;
  onChange: (value: number) => void;
};

let cancel = false;
export default function StepSlider({
  activeStepIndex,
  max,
  playbackTimeS,
  onChange,
}: StepSliderProps) {
  const [playing, setPlaying] = useState(false);

  const [intervalMS, stepIncrement] = useMemo(() => {
    let stepIncrement = 1;
    const interval = (playbackTimeS * 1000) / max;
    if (interval < 10) {
      stepIncrement = Math.ceil(10 / interval);
      return [10, stepIncrement];
    }

    return [interval, 1];
  }, [playbackTimeS, max]);

  if (playing) {
    setTimeout(() => {
      if (cancel) return;
      if (activeStepIndex < max) {
        onChange(activeStepIndex + stepIncrement);
      } else {
        setPlaying(false);
      }
    }, intervalMS);
  }

  const togglePlaying = () => {
    cancel = playing;
    setPlaying(!playing);

    if (activeStepIndex === max) {
      onChange(0);
    }
  };

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
      {playing ? pauseSVG : playSVG}
      <input
        type='range'
        className='slider'
        min={0}
        max={max}
        value={activeStepIndex}
        onChange={(e) => {
          onChange(parseInt(e.target.value));

          //manually stop playing if user interacts with the slider
          setPlaying(false);
          cancel = true;
        }}
      />
    </div>
  );
}
