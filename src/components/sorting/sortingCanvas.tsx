import "./sortingCanvas.css";
import { HTMLAttributes, useCallback, useEffect, useRef } from "react";
import useSize from "../../hooks/useSize";
import { useTheme } from "../../contexts/themeContext";

interface CanvasProps extends HTMLAttributes<HTMLCanvasElement> {
  data: number[];
  swap?: number[];
}

export default function SortingCanvas({ data, swap, ...props }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef);
  const theme = useTheme();

  const drawBars = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (canvas && container) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = theme.currentTheme === "light" ? "black" : "white";
        for (let i = 0; i < data.length; i++) {
          const xPos = (i * canvas.width) / data.length;
          const width = canvas.width / data.length + 1; // +1 to avoid micro-gaps
          const height = (data[i] * canvas.height) / data.length;
          ctx.fillRect(xPos, canvas.height - height, width, height);
        }

        // Draw the swaps
        if (swap) {
          const [i, j] = swap;
          const xPos1 = (i * canvas.width) / data.length;
          const xPos2 = (j * canvas.width) / data.length;
          const width = canvas.width / data.length + 1;
          const height1 = (data[i] * canvas.height) / data.length;
          const height2 = (data[j] * canvas.height) / data.length;
          ctx.fillStyle = "green";
          ctx.fillRect(xPos1, canvas.height - height1, width, height1);
          ctx.fillRect(xPos2, canvas.height - height2, width, height2);
        }
      }
    }
  }, [data, theme.currentTheme]);

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
