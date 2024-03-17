import { useMemo, useState } from "react";
import "./stepSlider.css";
import { useTheme } from "../contexts/themeContext";

type StepSliderProps = {
  label: string;
  activeStepIndex: number;
  maxStepIndex: number;
  playbackTimeS: number;
  onChange: (value: number) => void;
};

let cancel = false;
export default function StepSlider({
  label,
  activeStepIndex,
  maxStepIndex,
  playbackTimeS,
  onChange,
}: StepSliderProps) {
  const [playing, setPlaying] = useState(false);

  const [intervalMS, stepIncrement] = useMemo(() => {
    let stepIncrement = 1;
    const interval = (playbackTimeS * 1000) / maxStepIndex;
    if (interval < 10) {
      stepIncrement = Math.ceil(10 / interval);
      return [10, stepIncrement];
    }

    return [interval, 1];
  }, [playbackTimeS, maxStepIndex]);

  if (playing) {
    setTimeout(() => {
      if (cancel) return;
      if (activeStepIndex < maxStepIndex) {
        onChange(activeStepIndex + stepIncrement);
      } else {
        setPlaying(false);
      }
    }, intervalMS);
  }

  const togglePlaying = () => {
    cancel = playing;
    setPlaying(!playing);

    if (activeStepIndex === maxStepIndex) {
      onChange(0);
    }
  };

  const playSVG = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      onClick={() => togglePlaying()}
      viewBox='-20 -20 250 250'
      className='play-button'
    >
      <path d='M179.07,105L30.93,210V0L179.07,105z' />
    </svg>
  );

  const pauseSVG = (
    <svg
      viewBox='4 0 15 20'
      xmlns='http://www.w3.org/2000/svg'
      className='pause-button'
      onClick={() => togglePlaying()}
    >
      <path d='M5 16V4h3v12H5zm7-12h3v12h-3V4z' />
    </svg>
  );

  return (
    <div className='step-slider'>
      <span className='label'>
        {label + ` (${activeStepIndex} / ${maxStepIndex})`}
      </span>
      <div className='slider'>
        {playing ? pauseSVG : playSVG}
        <input
          type='range'
          className='slider'
          min={0}
          max={maxStepIndex}
          value={activeStepIndex}
          onChange={(e) => {
            onChange(parseInt(e.target.value));

            //manually stop playing if user interacts with the slider
            setPlaying(false);
            cancel = true;
          }}
        />
      </div>
    </div>
  );
}
