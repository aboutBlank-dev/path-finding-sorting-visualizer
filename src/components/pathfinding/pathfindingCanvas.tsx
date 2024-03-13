import { useEffect, useRef } from "react";
import useSize from "../../hooks/useSize";
import "./pathfindingCanvas.css";
import { GridNodeType, PathfindingGrid } from "../../types/pathfindingGrid";

export enum PathfindingCanvasMode {
  MAZE = "MAZE",
  PATHFINDING = "PATHFINDING",
}

type PathfindingCanvasProps = {
  inputGrid: PathfindingGrid;
  mazeGrid: PathfindingGrid;
  algorithmStepIndex: number;
  mode: PathfindingCanvasMode;
};

export default function PathfindingCanvas({
  inputGrid,
  mazeGrid,
  algorithmStepIndex,
  mode,
}: PathfindingCanvasProps) {
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null); //Grid Lines
  const foregroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef); //used to track when the panel is resized

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

      const grid = mode === PathfindingCanvasMode.MAZE ? mazeGrid : inputGrid;
      drawWalls(ctx, foregroundCanvas.width, foregroundCanvas.height, grid);
    }
  };

  useEffect(() => {
    drawBackground();
    drawForeground();
  }, [inputGrid.height, inputGrid.width, containerSize, containerRef]);

  useEffect(() => {
    drawForeground();
  }, [inputGrid.grid, mode, mazeGrid]);

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

const drawWalls = (
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
