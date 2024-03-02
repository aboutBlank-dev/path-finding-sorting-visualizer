import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./Sorting.css";
import SortingCanvas from "../components/sorting/sortingCanvas";
import StepSlider from "../components/stepSlider";
import { useState } from "react";
import { useSorting } from "../contexts/sortingContext";
import useMediaQuery from "../hooks/useMediaQuery";

export default function Sorting() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sortingContext = useSorting();

  const isMediumScreen = useMediaQuery("(max-width: 768px)");

  const handleStepChange = (value: number) => {
    setActiveStepIndex(value);
  };

  function ControlsSection(order: number) {
    return (
      <Panel defaultSize={isMediumScreen ? 50 : 33} id='controls' order={order}>
        <div className='controls-section'></div>
      </Panel>
    );
  }

  function VisualizeSection(order: number) {
    return (
      <Panel
        defaultSize={isMediumScreen ? 50 : 67}
        id='visualizer'
        order={order}
      >
        <div className='visualize-section'>
          <span className='algorithm-title'>{sortingContext.algorithm}</span>
          <SortingCanvas
            data={sortingContext.iterationSteps[activeStepIndex]?.input ?? []}
            swap={sortingContext.iterationSteps[activeStepIndex]?.swap ?? []}
          />
          <StepSlider
            max={sortingContext.iterationSteps.length - 1}
            onChange={handleStepChange}
          />
        </div>
      </Panel>
    );
  }

  return (
    <div className='page sorting-page'>
      <PanelGroup direction={isMediumScreen ? "vertical" : "horizontal"}>
        {isMediumScreen ? VisualizeSection(1) : ControlsSection(1)}
        <PanelResizeHandle className='resize-handle' />
        {isMediumScreen ? ControlsSection(2) : VisualizeSection(2)}
      </PanelGroup>
    </div>
  );
}
