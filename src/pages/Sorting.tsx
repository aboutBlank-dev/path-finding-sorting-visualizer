import "./Sorting.css";
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect } from "react";
import {
  isValidSortingAlgorithm,
  useSorting,
} from "../contexts/sortingContext";
import useMediaQuery from "../hooks/useMediaQuery";
import { useNavigate, useParams } from "react-router-dom";
import SortingControlsPanel from "../components/sorting/sortingControlsPanel";
import SortingVisualizePanel from "../components/sorting/sortingVisualizePanel";

export default function Sorting() {
  const sortingContext = useSorting();
  const isMediumScreen = useMediaQuery("(max-width: 768px)");

  const params = useParams();
  const navigate = useNavigate();

  //Change the URL based on the algorithm
  useEffect(() => {
    navigate(`/sorting-visualizer/${sortingContext.sortingAlgorithm}`);
  }, [sortingContext.sortingAlgorithm]);

  //Change the algorithm based on the URL
  useEffect(() => {
    const algorithm = params.algorithm;
    if (algorithm && isValidSortingAlgorithm(algorithm))
      sortingContext.setAlgorithm(algorithm);
  }, []);

  return (
    <div className='page sorting-page'>
      <PanelGroup direction={isMediumScreen ? "vertical" : "horizontal"}>
        {/* Change the order/size of the panels based on the screen size */}
        {isMediumScreen ? (
          <SortingVisualizePanel
            order={1}
            defaultSize={50}
            id='visualize-panel'
          />
        ) : (
          <SortingControlsPanel
            order={1}
            defaultSize={33}
            id='controls-panel'
          />
        )}
        <PanelResizeHandle className='resize-handle' />
        {isMediumScreen ? (
          <SortingControlsPanel
            order={2}
            defaultSize={50}
            id='controls-panel'
          />
        ) : (
          <SortingVisualizePanel
            order={2}
            defaultSize={67}
            id='visualize-panel'
          />
        )}
      </PanelGroup>
    </div>
  );
}
