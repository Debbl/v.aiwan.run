import React, { useEffect, useRef } from "react";
import { DoublePendulum } from "./DoublePendulum";

const Index: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const doublePendulum = new DoublePendulum({
      useWebGL: false,
      canvas: canvasRef.current!,
    });

    window.requestAnimationFrame(doublePendulum.render.bind(doublePendulum));
  }, []);
  return (
    <div className="mt-16 flex min-w-[300px] flex-col items-center justify-center sm:flex-row">
      <canvas ref={canvasRef}>
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </div>
  );
};

export default Index;
