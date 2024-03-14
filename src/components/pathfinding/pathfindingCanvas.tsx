import { useEffect, useMemo, useRef } from "react";
import useSize from "../../hooks/useSize";
import "./pathfindingCanvas.css";
import { GridNodeType, PathfindingGrid } from "../../types/pathfindingGrid";
import {
  PathfindingIterationStep,
  PathfindingIterationStepAction,
} from "../../types/pathfindingIterationStep";
import { PathfindingDrawMode } from "../../contexts/pathfindingContext";

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
}: PathfindingCanvasProps) {
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null); //Grid Lines
  const foregroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef); //used to track when the panel is resized
  const isMouseDown = useRef(false);
  const lastCellClicked = useRef<Coordinate | null>(null);

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

  const drawForeground = () => {
    const foregroundCanvas = foregroundCanvasRef.current;
    const ctx = foregroundCanvas?.getContext("2d");

    if (ctx && foregroundCanvas) {
      ctx.clearRect(0, 0, foregroundCanvas.width, foregroundCanvas.height);

      if (visualizeMode === PathfindingVisualizeMode.PATHFINDING) {
        drawPathfinding(
          ctx,
          pathfindingSteps,
          foregroundCanvas.width,
          foregroundCanvas.height,
          inputGrid.width,
          inputGrid.height
        );
      }

      const grid =
        visualizeMode === PathfindingVisualizeMode.MAZE ? mazeGrid : inputGrid;
      drawNodes(ctx, foregroundCanvas.width, foregroundCanvas.height, grid);
    }
  };

  useEffect(() => {
    drawBackground();
    drawForeground();
  }, [inputGrid.height, inputGrid.width, containerSize, containerRef]);

  useEffect(() => {
    drawForeground();
  }, [inputGrid.grid, visualizeMode, mazeGrid, pathfindingSteps]);

  //Handle drawing (mouse move)
  useEffect(() => {
    const canvas = foregroundCanvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown.current = true;
    };

    const handleMouseUp = (e: MouseEvent) => {
      isMouseDown.current = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleCellClicked = (row: number, col: number) => {
    lastCellClicked.current = { x: row, y: col };
    console.log("Clicked cell in row: ", row, "col: ", col);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = foregroundCanvasRef.current;
    if (isMouseDown.current && canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cellWidth = canvas.width / inputGrid.width;
      const cellHeight = canvas.height / inputGrid.height;

      const row = Math.floor(y / cellHeight);
      const col = Math.floor(x / cellWidth);
    }
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
  canvasWidth: number,
  canvasHeight: number,
  width: number,
  height: number
) => {
  const cellWidth = canvasWidth / width;
  const cellHeight = canvasHeight / height;
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
