import { PathfindingDrawMode } from "../../contexts/pathfindingContext";

type DrawButtonsProps = {
  drawMode: PathfindingDrawMode;
  onDrawButtonClick: (drawMode: PathfindingDrawMode) => void;
};

export default function DrawButtons({
  drawMode,
  onDrawButtonClick,
}: DrawButtonsProps) {
  return (
    <div className='draw-buttons-container'>
      <button
        className={
          "draw-button " +
          (drawMode === PathfindingDrawMode.WALL ? " active" : "")
        }
        onClick={() => onDrawButtonClick(PathfindingDrawMode.WALL)}
      >
        WALL
      </button>
      <button
        className={
          "draw-button" +
          (drawMode === PathfindingDrawMode.START ? " active" : "")
        }
        onClick={() => onDrawButtonClick(PathfindingDrawMode.START)}
      >
        START
      </button>
      <button
        className={
          "draw-button " +
          (drawMode === PathfindingDrawMode.END ? " active" : "")
        }
        onClick={() => onDrawButtonClick(PathfindingDrawMode.END)}
      >
        END
      </button>
    </div>
  );
}
