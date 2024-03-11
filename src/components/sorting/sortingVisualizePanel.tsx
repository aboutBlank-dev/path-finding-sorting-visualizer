import { Panel, PanelProps } from "react-resizable-panels";
import StepSlider from "../stepSlider";
import SortingCanvas from "./sortingCanvas";
import { useState } from "react";
import { useSorting } from "../../contexts/sortingContext";
import { getSortingDataStateIteration } from "../../types/sortingIterationStep";

export default function SortingVisualizePanel(props: PanelProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sortingContext = useSorting();

  const onActiveStepChange = (index: number) => {
    if (index !== activeStepIndex) {
      setActiveStepIndex(index);
      sortingContext.playStepAudio(sortingContext.iterationSteps[index]);
    }
  };

  return (
    <Panel {...props} minSize={25}>
      <div className='visualize-section-wrapper'>
        <div className='visualize-section'>
          <span className='algorithm-title'>
            {sortingContext.sortingAlgorithm}
          </span>
          <SortingCanvas
            data={getSortingDataStateIteration(activeStepIndex, sortingContext)}
            swap={sortingContext.iterationSteps[activeStepIndex]?.indexes ?? []}
          />
          <StepSlider
            max={sortingContext.iterationSteps.length - 1}
            playbackTimeS={sortingContext.playbackTimeS}
            onChange={(value: number) => onActiveStepChange(value)}
          />
        </div>
      </div>
    </Panel>
  );
}
