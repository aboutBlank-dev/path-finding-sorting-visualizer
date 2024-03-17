import { PathfindingDrawMode } from "../../contexts/pathfindingContext";
import "./drawButtons.css";

type DrawButtonsProps = {
  drawMode: PathfindingDrawMode;
  onDrawButtonClick: (drawMode: PathfindingDrawMode) => void;
};

export default function DrawButtons({
  drawMode,
  onDrawButtonClick,
}: DrawButtonsProps) {
  return (
    <div className='outline-card draw-buttons-component'>
      <div> Draw </div>
      <div className='draw-buttons-container'>
        <DrawButton
          buttonDrawMode={PathfindingDrawMode.WALL}
          currentDrawMode={drawMode}
          onClicked={onDrawButtonClick}
        />
        <DrawButton
          buttonDrawMode={PathfindingDrawMode.START}
          currentDrawMode={drawMode}
          onClicked={onDrawButtonClick}
        />
        <DrawButton
          buttonDrawMode={PathfindingDrawMode.END}
          currentDrawMode={drawMode}
          onClicked={onDrawButtonClick}
        />
      </div>
    </div>
  );
}

type DrawButtonProps = {
  currentDrawMode: PathfindingDrawMode;
  buttonDrawMode: PathfindingDrawMode;
  onClicked: (newDrawMode: PathfindingDrawMode) => void;
};

function DrawButton({
  currentDrawMode,
  buttonDrawMode,
  onClicked,
}: DrawButtonProps) {
  const active = currentDrawMode === buttonDrawMode;
  let className = "outline-card draw-button";
  if (active) className += " active";

  return (
    <div className={className} onClick={() => onClicked(buttonDrawMode)}>
      <div id={PathfindingDrawMode[buttonDrawMode]}></div>
      <span>{PathfindingDrawMode[buttonDrawMode].toLowerCase()}</span>
    </div>
  );
}
