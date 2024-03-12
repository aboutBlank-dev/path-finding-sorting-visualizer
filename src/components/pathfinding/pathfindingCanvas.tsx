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

  const drawWalls = () => {
    const foregroundCanvas = foregroundCanvasRef.current;
    const ctx = foregroundCanvas?.getContext("2d");

    if (ctx && foregroundCanvas && inputGrid.grid) {
      ctx.clearRect(0, 0, foregroundCanvas.width, foregroundCanvas.height);

      const { width, height } = inputGrid;
      const cellWidth = foregroundCanvas.width / width;
      const cellHeight = foregroundCanvas.height / height;

      const gridToUse = mazeGrid ?? inputGrid;
      gridToUse.grid.forEach((row) => {
        row.forEach((node) => {
          if (node.nodeType === GridNodeType.WALL) {
            ctx.fillStyle = "black";
            ctx.fillRect(
              node.y * cellWidth,
              node.x * cellHeight,
              cellWidth,
              cellHeight
            );
          }
        });
      });
    }
  };

  const drawGridLines = () => {
    const backgroundCanvas = backgroundCanvasRef.current;
    const ctx = backgroundCanvas?.getContext("2d");

    if (ctx && backgroundCanvas) {
      ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

      const { width, height } = inputGrid;
      const cellWidth = backgroundCanvas.width / width;
      const cellHeight = backgroundCanvas.height / height;

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "black";
      //draw vertical lines
      for (let i = 0; i <= width; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellWidth, 0);
        ctx.lineTo(i * cellWidth, backgroundCanvas.height);
        ctx.stroke();
      }

      //draw horizontal lines
      for (let i = 0; i <= height; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellHeight);
        ctx.lineTo(backgroundCanvas.width, i * cellHeight);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    drawGridLines();
  }, [inputGrid.height, inputGrid.width, containerSize, containerRef]);

  useEffect(() => {
    drawWalls();
  }, [inputGrid, containerSize, containerRef, mode, mazeGrid]);

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
