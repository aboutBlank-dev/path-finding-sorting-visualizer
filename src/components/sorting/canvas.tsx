import "./canvas.css";
import { useCallback, useEffect, useMemo, useRef } from "react";
import useSize from "../../hooks/useSize";

export default function Canvas(
  props: React.CanvasHTMLAttributes<HTMLCanvasElement>
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef);

  const arr = useMemo(() => {
    const arr = [...Array(100).keys()].map((i) => i + 1);
    arr.sort(() => Math.random() - 0.5);
    return arr;
  }, []);

  const drawBars = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "yellow";
        for (let i = 0; i < arr.length; i++) {
          const xPos = (i * canvas.width) / arr.length;
          const width = canvas.width / arr.length + 0.5; // +0.5 to avoid weird artifacts
          const height = (arr[i] * canvas.height) / arr.length;
          ctx.fillRect(xPos, canvas.height - height, width, height);
        }
      }
    }
  }, [arr]);

  useEffect(() => {
    drawBars();
  });

  return (
    <div className='canvas-container' ref={containerRef}>
      <canvas
        width={containerSize?.width}
        height={containerSize?.height}
        ref={canvasRef}
        {...props}
      />
    </div>
  );
}
