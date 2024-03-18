import { Panel, PanelProps } from "react-resizable-panels";
import StepSlider from "../stepSlider";
import SortingCanvas from "./sortingCanvas";
import { useEffect, useState } from "react";
import { useSorting } from "../../contexts/sortingContext";
import { getSortingDataIteration } from "../../types/sortingIterationStep";

export default function SortingVisualizePanel(props: PanelProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [dataState, setDataState] = useState<number[]>([]);
  const sortingContext = useSorting();

  const onActiveStepChange = (index: number) => {
    if (index !== activeStepIndex) {
      setActiveStepIndex(index);
      const newDataState = getSortingDataIteration(index, sortingContext);
      setDataState(newDataState);

      //sound
      const values = [];
      for (const indexes of sortingContext.iterationSteps[index].indexes) {
        values.push(newDataState[indexes]);
      }

      sortingContext.playStepAudio(
        sortingContext.iterationSteps[index],
        values
      );
    }
  };

  useEffect(() => {
    setActiveStepIndex(0);
  }, [sortingContext.sortingAlgorithm]);

  return (
    <Panel {...props} minSize={25}>
      <div className='visualize-section-wrapper'>
        <div className='visualize-section'>
          <span className='algorithm-title'>
            {sortingContext.sortingAlgorithm}
          </span>
          <SortingCanvas
            data={getSortingDataIteration(activeStepIndex, sortingContext)}
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
