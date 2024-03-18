import { Panel, PanelProps } from "react-resizable-panels";
import StepSlider from "../stepSlider";
import SortingCanvas from "./sortingCanvas";
import { useEffect, useRef, useState } from "react";
import { useSorting } from "../../contexts/sortingContext";
import { getSortingDataIteration } from "../../types/sortingIterationStep";

export default function SortingVisualizePanel(props: PanelProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const dataState = useRef<number[]>([]);
  const sortingContext = useSorting();

  const onActiveStepChange = (index: number) => {
    if (index !== activeStepIndex) {
      setActiveStepIndex(index);
      dataState.current = getSortingDataIteration(index, sortingContext);

      //sound
      const values = [];
      for (const indexes of sortingContext.iterationSteps[index].indexes) {
        values.push(dataState.current[indexes]);
      }

      sortingContext.playStepAudio(
        sortingContext.iterationSteps[index],
        values
      );
    }
  };

  useEffect(() => {
    setActiveStepIndex(0);
    dataState.current = getSortingDataIteration(0, sortingContext);
  }, [sortingContext.sortingAlgorithm, sortingContext.input]);

  return (
    <Panel {...props} minSize={25}>
      <div className='visualize-section-wrapper'>
        <div className='visualize-section'>
          <span className='algorithm-title'>
            {sortingContext.sortingAlgorithm}
          </span>
          <SortingCanvas
            data={dataState.current}
            swap={sortingContext.iterationSteps[activeStepIndex]?.indexes ?? []}
          />
          <StepSlider
            label='Sorting Step'
            activeStepIndex={activeStepIndex}
            maxStepIndex={sortingContext.iterationSteps.length - 1}
            playbackTimeS={sortingContext.playbackTimeS}
            onChange={(value: number) => onActiveStepChange(value)}
          />
        </div>
      </div>
    </Panel>
  );
}
