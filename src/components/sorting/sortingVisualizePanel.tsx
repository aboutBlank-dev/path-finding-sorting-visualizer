import { Panel, PanelProps } from "react-resizable-panels";
import StepSlider from "../stepSlider";
import SortingCanvas from "./sortingCanvas";
import { useState } from "react";
import { getDataState, useSorting } from "../../contexts/sortingContext";

export default function SortingVisualizePanel(props: PanelProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sortingContext = useSorting();

  return (
    <Panel {...props}>
      <div className='visualize-section-wrapper'>
        <div className='visualize-section'>
          <span className='algorithm-title'>
            {sortingContext.sortingAlgorithm}
          </span>
          <SortingCanvas
            data={getDataState(activeStepIndex, sortingContext)}
            swap={sortingContext.iterationSteps[activeStepIndex]?.swap ?? []}
          />
          <StepSlider
            max={sortingContext.iterationSteps.length - 1}
            playbackTimeS={sortingContext.playbackTimeS}
            onChange={(value: number) => setActiveStepIndex(value)}
          />
        </div>
      </div>
    </Panel>
  );
}
