import { useEffect, useRef } from "react";

function CanvasSign() {
  const cEl = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!cEl.current) return;
    const ctx = cEl.current.getContext("2d")!;
    // const width = cEl.current.width;
    // const height = cEl.current.height;
    // if (window.devicePixelRatio) {
    //   cEl.current.style.width = `${width}px`;
    //   cEl.current.style.height = `${height}px`;
    //   cEl.current.height = height * window.devicePixelRatio;
    //   cEl.current.width = width * window.devicePixelRatio;
    //   ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    // }
    function mouseMoveHandle(e: MouseEvent) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
    cEl.current.addEventListener("mousedown", (e) => {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.shadowBlur = 1;
      ctx.moveTo(e.offsetX, e.offsetY);
      cEl.current!.addEventListener("mousemove", mouseMoveHandle);
    });
    cEl.current.addEventListener("mouseup", () => {
      cEl.current!.removeEventListener("mousemove", mouseMoveHandle);
    });
  }, []);
  return (
    <div className="bg-[#eee]">
      <canvas ref={cEl} width="400" height="400" className="border"></canvas>
    </div>
  );
}

export default CanvasSign;
