import { useEffect, useRef } from "react";
import useSize from "../../hooks/useSize";
import "./pathfindingCanvas.css";
import { GridNodeType, PathfindingGrid } from "../../types/pathfindingGrid";
import {
  PathfindingIterationStep,
  PathfindingIterationStepAction,
} from "../../types/pathfindingIterationStep";
import { PathfindingDrawMode } from "../../contexts/pathfindingContext";
import { GridUtils } from "../../utils/gridUtils";

export enum PathfindingVisualizeMode {
  MAZE,
  PATHFINDING,
}

type PathfindingCanvasProps = {
  inputGrid: PathfindingGrid;
  mazeGrid: PathfindingGrid;
  pathfindingSteps: PathfindingIterationStep[];
  visualizeMode: PathfindingVisualizeMode;
  drawMode: PathfindingDrawMode;
  onGridChange: (grid: PathfindingGrid) => void;
  onInteraction: () => void;
};

interface Coordinate {
  x: number;
  y: number;
}

export default function PathfindingCanvas({
  inputGrid,
  mazeGrid,
  pathfindingSteps,
  visualizeMode,
  drawMode,
  onGridChange,
  onInteraction,
}: PathfindingCanvasProps) {
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null); //Grid Lines
  const foregroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef); //used to track when the panel is resized
  const isMouseDown = useRef(false);
  const paintedThisUpdate = useRef(false); //used to prevent bug where the user can paint without the inputGrid being updated in props yet.
  const lastCellClicked = useRef<Coordinate | null>(null);
  const firstDragNodeType = useRef<GridNodeType | null>(null); //used to determine whether the current "drag" should paint WALL or an EMPTY

  useEffect(() => {
    drawBackground();
    drawForeground();
  }, [inputGrid.height, inputGrid.width, containerSize, containerRef]);

  useEffect(() => {
    drawForeground();
  }, [inputGrid.grid, visualizeMode, mazeGrid, pathfindingSteps]);

  //Draws the background canvas (grid lines)
  const drawBackground = () => {
    const backgroundCanvas = backgroundCanvasRef.current;
    const ctx = backgroundCanvas?.getContext("2d");

    if (ctx && backgroundCanvas) {
      ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
      drawGridLines(
        ctx,
        backgroundCanvas.width,
        backgroundCanvas.height,
        inputGrid.width,
        inputGrid.height
      );
    }
  };

  //Draws the foreground canvas (nodes/pathfinding)
  const drawForeground = () => {
    const foregroundCanvas = foregroundCanvasRef.current;
    const ctx = foregroundCanvas?.getContext("2d");

    if (ctx && foregroundCanvas) {
      ctx.clearRect(0, 0, foregroundCanvas.width, foregroundCanvas.height);

      const cellWidth = foregroundCanvas.width / inputGrid.width;
      const cellHeight = foregroundCanvas.height / inputGrid.height;
      if (visualizeMode === PathfindingVisualizeMode.PATHFINDING) {
        drawPathfinding(ctx, pathfindingSteps, cellWidth, cellHeight);
      }

      const grid =
        visualizeMode === PathfindingVisualizeMode.MAZE ? mazeGrid : inputGrid;

      drawNodes(ctx, foregroundCanvas.width, foregroundCanvas.height, grid);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = foregroundCanvasRef.current;
    if (!canvas) return;

    isMouseDown.current = true;
    const cellClicked = getCellFromMousePosition(
      canvas,
      e,
      canvas.width / inputGrid.width,
      canvas.height / inputGrid.height
    );

    handleCellDraw(cellClicked.x, cellClicked.y);
    onInteraction();
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    paintedThisUpdate.current = false;
    firstDragNodeType.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = foregroundCanvasRef.current;
    if (isMouseDown.current && canvas) {
      const { x, y } = getCellFromMousePosition(
        canvas,
        e,
        canvas.width / inputGrid.width,
        canvas.height / inputGrid.height
      );

      if (
        lastCellClicked.current &&
        (lastCellClicked.current.x !== x || lastCellClicked.current.y !== y)
      ) {
        handleCellDraw(x, y);
      }
    }
  };

  const handleCellDraw = (x: number, y: number) => {
    lastCellClicked.current = { x: x, y: y };
    if (x < 0 || x >= inputGrid.height || y < 0 || y >= inputGrid.width) return;

    if (paintedThisUpdate.current) return;

    const clickedNode = inputGrid.grid[x][y];
    let newGrid = inputGrid;
    switch (drawMode) {
      case PathfindingDrawMode.START:
        if (clickedNode.nodeType !== GridNodeType.EMPTY) return;
        newGrid = GridUtils.moveStartNode({ x: x, y: y }, inputGrid);
        break;

      case PathfindingDrawMode.END:
        if (clickedNode.nodeType !== GridNodeType.EMPTY) return;
        newGrid = GridUtils.moveEndNode({ x: x, y: y }, inputGrid);
        break;

      case PathfindingDrawMode.WALL:
        if (
          clickedNode.nodeType === GridNodeType.START ||
          clickedNode.nodeType === GridNodeType.END
        )
          return;

        if (firstDragNodeType.current === null) {
          firstDragNodeType.current = clickedNode.nodeType;
        }

        //If the first cell clicked was a WALL, paint ON WALLS only (only paint empty cells)
        //If the first cell clicked was an EMPTY, paint ON EMPTY CELLS only (only paint walls)
        if (
          firstDragNodeType.current === GridNodeType.WALL &&
          clickedNode.nodeType === GridNodeType.WALL
        ) {
          newGrid = GridUtils.removeWall({ x: x, y: y }, inputGrid);
        } else if (
          firstDragNodeType.current === GridNodeType.EMPTY &&
          clickedNode.nodeType === GridNodeType.EMPTY
        ) {
          newGrid = GridUtils.addWall({ x: x, y: y }, inputGrid);
        } else return;
        break;
    }

    onGridChange(newGrid);
    paintedThisUpdate.current = true;
  };

  // Canvas size/Aspect ratio calculations
  let canvasWidth = 0;
  let canvasHeight = 0;
  if (containerSize) {
    const gridAspectRatio = inputGrid.width / inputGrid.height;
    const containerAspectRatio = containerSize.width / containerSize.height;

    if (gridAspectRatio > containerAspectRatio) {
      canvasWidth = containerSize.width;
      canvasHeight = containerSize.width / gridAspectRatio;
    } else {
      canvasHeight = containerSize.height;
      canvasWidth = containerSize.height * gridAspectRatio;
    }
  }

  paintedThisUpdate.current = false;
  return (
    <div className='canvas-container' ref={containerRef}>
      <canvas
        ref={backgroundCanvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ zIndex: 1 }}
      />
      <canvas
        ref={foregroundCanvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ zIndex: 2 }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}

const drawGridLines = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  gridWidth: number,
  gridHeight: number
) => {
  const cellWidth = canvasWidth / gridWidth;
  const cellHeight = canvasHeight / gridHeight;

  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "black";
  //draw vertical lines
  for (let i = 0; i <= gridWidth; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellWidth, 0);
    ctx.lineTo(i * cellWidth, canvasHeight);
    ctx.stroke();
  }

  //draw horizontal lines
  for (let i = 0; i <= gridHeight; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * cellHeight);
    ctx.lineTo(canvasWidth, i * cellHeight);
    ctx.stroke();
  }
};

const drawNodes = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  pathfindingGrid: PathfindingGrid
) => {
  if (pathfindingGrid.grid) {
    const { width, height } = pathfindingGrid;
    const cellWidth = canvasWidth / width;
    const cellHeight = canvasHeight / height;

    pathfindingGrid.grid.forEach((row) => {
      row.forEach((node) => {
        switch (node.nodeType) {
          case GridNodeType.WALL:
            ctx.fillStyle = "black";
            break;
          case GridNodeType.START:
            ctx.fillStyle = "green";
            break;
          case GridNodeType.END:
            ctx.fillStyle = "red";
            break;
          default:
            return;
        }

        ctx.fillRect(
          node.y * cellWidth,
          node.x * cellHeight,
          cellWidth,
          cellHeight
        );
      });
    });
  }
};

const drawPathfinding = (
  ctx: CanvasRenderingContext2D,
  pathfindingSteps: PathfindingIterationStep[],
  cellWidth: number,
  cellHeight: number
) => {
  for (const step of pathfindingSteps) {
    switch (step.action) {
      case PathfindingIterationStepAction.VISIT:
        ctx.fillStyle = "blue";
        break;
      case PathfindingIterationStepAction.PATH:
        ctx.fillStyle = "yellow";
        break;
      default:
        return;
    }

    step.coordinates.forEach((coord) => {
      ctx.fillRect(
        coord.y * cellWidth,
        coord.x * cellHeight,
        cellWidth,
        cellHeight
      );
    });
  }
};

function getCellFromMousePosition(
  canvas: HTMLCanvasElement,
  e: React.MouseEvent,
  cellWidth: number,
  cellHeight: number
): Coordinate {
  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;

  const row = Math.floor(y / cellHeight);
  const col = Math.floor(x / cellWidth);

  return { x: row, y: col };
}
