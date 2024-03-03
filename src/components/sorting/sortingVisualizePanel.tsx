import { Panel, PanelProps } from "react-resizable-panels";
import StepSlider from "../stepSlider";
import SortingCanvas from "./sortingCanvas";
import { useState } from "react";
import { useSorting } from "../../contexts/sortingContext";

export default function SortingVisualizePanel(props: PanelProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sortingContext = useSorting();

  return (
    <Panel {...props}>
      <div className='visualize-section'>
        <span className='algorithm-title'>{sortingContext.algorithm}</span>
        <SortingCanvas
          data={sortingContext.iterationSteps[activeStepIndex]?.input ?? []}
          swap={sortingContext.iterationSteps[activeStepIndex]?.swap ?? []}
        />
        <StepSlider
          max={sortingContext.iterationSteps.length - 1}
          onChange={(value: number) => setActiveStepIndex(value)}
        />
      </div>
    </Panel>
  );
}
