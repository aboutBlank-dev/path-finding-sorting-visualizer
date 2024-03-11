import { useEffect, useRef } from "react";
import useSize from "../../hooks/useSize";
import "./pathfindingCanvas.css";

type PathfindingCanvasProps = {};
export default function PathfindingCanvas() {
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const foregroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef);

  useEffect(() => {
    const backgroundCanvas = backgroundCanvasRef.current;
    const foregroundCanvas = foregroundCanvasRef.current;

    if (backgroundCanvas && foregroundCanvas) {
      const ctx = backgroundCanvas.getContext("2d");
      const ctx2 = foregroundCanvas.getContext("2d");

      if (ctx && ctx2) {
        ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
        ctx2.clearRect(0, 0, foregroundCanvas.width, foregroundCanvas.height);
      }
    }
  }, [containerSize]);

  return (
    <div className='canvas-container' ref={containerRef}>
      <canvas
        ref={backgroundCanvasRef}
        width={containerSize?.width}
        height={containerSize?.height}
      />
      <canvas
        ref={foregroundCanvasRef}
        width={containerSize?.width}
        height={containerSize?.height}
      />
    </div>
  );
}
