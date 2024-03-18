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
import { ThemeContextType, useTheme } from "../../contexts/themeContext";

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
  drawingEnabled: boolean;
  onGridChange: (grid: PathfindingGrid) => void;
  onInteraction: () => void;
};

interface Coordinate {
  x: number;
  y: number;
}

const GRID_LINE_WIDTH = 1;
export default function PathfindingCanvas({
  inputGrid,
  mazeGrid,
  pathfindingSteps,
  visualizeMode,
  drawingEnabled,
  drawMode,
  onGridChange,
  onInteraction,
}: PathfindingCanvasProps) {
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null); //Grid Lines
  const foregroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const pathfindingCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef); //used to track when the panel is resized
  const isMouseDown = useRef(false);
  const paintedThisUpdate = useRef(false); //used to prevent bug where the user can paint without the inputGrid being updated in props yet.
  const lastCellClicked = useRef<Coordinate | null>(null);
  const firstDragNodeType = useRef<GridNodeType | null>(null); //used to determine whether the current "drag" should paint WALL or an EMPTY

  const theme = useTheme();

  useEffect(() => {
    drawBackground();
    drawForeground();
    drawPathfinding();
  }, [
    inputGrid.height,
    inputGrid.width,
    containerSize,
    containerRef,
    theme.currentTheme,
  ]);

  useEffect(() => {
    drawForeground();
  }, [inputGrid.grid, visualizeMode, mazeGrid]);

  useEffect(() => {
    drawPathfinding();
  }, [pathfindingSteps]);

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
        inputGrid.height,
        theme
      );
    }
  };

  //Draws the foreground canvas (nodes/pathfinding)
  const drawForeground = () => {
    const foregroundCanvas = foregroundCanvasRef.current;
    const ctx = foregroundCanvas?.getContext("2d");

    if (ctx && foregroundCanvas) {
      ctx.clearRect(0, 0, foregroundCanvas.width, foregroundCanvas.height);

      const grid =
        visualizeMode === PathfindingVisualizeMode.MAZE ? mazeGrid : inputGrid;

      drawNodes(
        ctx,
        foregroundCanvas.width,
        foregroundCanvas.height,
        grid,
        theme
      );
    }
  };

  const drawPathfinding = () => {
    const pathfindingCanvas = pathfindingCanvasRef.current;
    const ctx = pathfindingCanvas?.getContext("2d");

    if (ctx && pathfindingCanvas) {
      ctx.clearRect(0, 0, pathfindingCanvas.width, pathfindingCanvas.height);

      const cellWidth = pathfindingCanvas.width / inputGrid.width;
      const cellHeight = pathfindingCanvas.height / inputGrid.height;

      if (visualizeMode === PathfindingVisualizeMode.PATHFINDING) {
        drawPathfindingSteps(ctx, pathfindingSteps, cellWidth, cellHeight);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!drawingEnabled) return;

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
    if (!drawingEnabled) return;

    isMouseDown.current = false;
    paintedThisUpdate.current = false;
    firstDragNodeType.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawingEnabled) return;

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
        ref={pathfindingCanvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ zIndex: 2 }}
      />
      <canvas
        ref={foregroundCanvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ zIndex: 3 }}
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
  gridHeight: number,
  theme: ThemeContextType
) => {
  const cellWidth = canvasWidth / gridWidth;
  const cellHeight = canvasHeight / gridHeight;

  ctx.lineWidth = GRID_LINE_WIDTH;
  ctx.strokeStyle =
    theme.currentTheme === "dark" ? "rgb(180, 180, 180)" : "black";

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
  pathfindingGrid: PathfindingGrid,
  theme: ThemeContextType
) => {
  if (pathfindingGrid.grid) {
    const { width, height } = pathfindingGrid;
    const cellWidth = canvasWidth / width;
    const cellHeight = canvasHeight / height;

    pathfindingGrid.grid.forEach((row) => {
      row.forEach((node) => {
        switch (node.nodeType) {
          case GridNodeType.WALL:
            ctx.fillStyle =
              theme.currentTheme === "dark" ? "rgb(180, 180, 180)" : "black";
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
          Math.floor(node.y * cellWidth),
          Math.floor(node.x * cellHeight),
          Math.floor(cellWidth) + 1,
          Math.floor(cellHeight) + 1
        );
      });
    });
  }
};

const drawPathfindingSteps = (
  ctx: CanvasRenderingContext2D,
  pathfindingSteps: PathfindingIterationStep[],
  cellWidth: number,
  cellHeight: number
) => {
  for (let i = 0; i < pathfindingSteps.length; i++) {
    const step = pathfindingSteps[i];
    switch (step.action) {
      case PathfindingIterationStepAction.VISIT:
        ctx.fillStyle = "rgba(0, 0, 100, 0.5)";
        break;
      case PathfindingIterationStepAction.PATH:
        ctx.fillStyle = "rgb(0, 255, 0)";
        break;
      default:
        return;
    }

    if (i == pathfindingSteps.length - 1) {
      ctx.fillStyle = "purple";
    }

    step.coordinates.forEach((coord) => {
      ctx.fillRect(
        Math.floor(coord.y * cellWidth),
        Math.floor(coord.x * cellHeight),
        Math.floor(cellWidth) + 1,
        Math.floor(cellHeight) + 1
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
