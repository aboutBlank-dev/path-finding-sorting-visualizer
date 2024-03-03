import "./Sorting.css";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SortingCanvas from "../components/sorting/sortingCanvas";
import StepSlider from "../components/stepSlider";
import { useEffect, useState } from "react";
import {
  SortingAlgorithm,
  isValidSortingAlgorithm,
  useSorting,
} from "../contexts/sortingContext";
import useMediaQuery from "../hooks/useMediaQuery";
import { useNavigate, useParams } from "react-router-dom";

export default function Sorting() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sortingContext = useSorting();
  const isMediumScreen = useMediaQuery("(max-width: 768px)");

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const algorithm = params.algorithm;
    if (algorithm && isValidSortingAlgorithm(algorithm)) {
      sortingContext.setAlgorithm(algorithm);
    } else {
      navigate("/sorting-visualizer/" + sortingContext.algorithm);
    }
  }, [params.algorithm]);

  function ControlsSection(order: number) {
    return (
      <Panel defaultSize={isMediumScreen ? 50 : 33} id='controls' order={order}>
        <div className='controls-section'>
          <select
            name='algorithms'
            id='sorting-algorithms'
            onChange={onAlgorithmChange}
            value={sortingContext.algorithm}
          >
            {Object.values(SortingAlgorithm).map((algorithm) => {
              return (
                <option key={algorithm} value={algorithm}>
                  {algorithm}
                </option>
              );
            })}
          </select>
        </div>
      </Panel>
    );
  }

  const onAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (isValidSortingAlgorithm(value)) {
      sortingContext.setAlgorithm(value);
      navigate(`/sorting-visualizer/${value.toLowerCase()}`);
    }
  };

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

  const handleStepChange = (value: number) => {
    setActiveStepIndex(value);
  };

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
