import { useNavigate, useParams } from "react-router-dom";
import { usePathfinding } from "../contexts/pathfindingContext";
import { useEffect } from "react";
import { isValidPathfindingAlgorithm } from "../types/PathfindingAlgorithm";
import useMediaQuery from "../hooks/useMediaQuery";
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import PathfindingControlsPanel from "../components/pathfinding/pathfindingControlsPanel";
import PathfindingVisualizePanel from "../components/pathfinding/pathfindingVisualizePanel";
import "./Pathfinding.css";

export default function Pathfinding() {
  const isMediumScreen = useMediaQuery("(max-width: 768px)");
  const pathfindingContext = usePathfinding();
  const params = useParams();
  const navigate = useNavigate();

  //Change the URL based on the algorithm
  useEffect(() => {
    navigate(
      `/pathfinding-visualizer/${pathfindingContext.pathfindingAlgorithm}`
    );
  }, [pathfindingContext.pathfindingAlgorithm]);

  //Change the algorithm based on the URL
  useEffect(() => {
    const algorithm = params.algorithm;
    if (algorithm && isValidPathfindingAlgorithm(algorithm))
      pathfindingContext.setAlgorithm(algorithm);
  }, []);

  return (
    <div className='page'>
      <PanelGroup direction={isMediumScreen ? "vertical" : "horizontal"}>
        {/* Change the order/size of the panels based on the screen size */}
        {isMediumScreen ? (
          <PathfindingVisualizePanel
            order={1}
            defaultSize={50}
            id='pathfinding-visualize-panel'
          />
        ) : (
          <PathfindingControlsPanel
            order={1}
            defaultSize={33}
            id='pathfinding-controls-panel'
          />
        )}
        <PanelResizeHandle className='resize-handle' />
        {isMediumScreen ? (
          <PathfindingControlsPanel
            order={2}
            defaultSize={50}
            id='pathfinding-controls-panel'
          />
        ) : (
          <PathfindingVisualizePanel
            order={2}
            defaultSize={67}
            id='pathfinding-visualize-panel'
          />
        )}
      </PanelGroup>
    </div>
  );
}
