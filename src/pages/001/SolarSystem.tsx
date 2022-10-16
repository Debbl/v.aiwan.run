import { useEffect, useRef } from "react";
import Sun from "./images/sun.png";
import Moon from "./images/moon.png";
import Earth from "./images/earth.png";

function SolarSystem() {
  const cEl = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = cEl.current!.getContext("2d")!;
    const sunImage = new Image();
    const moonImage = new Image();
    const earthImage = new Image();
    sunImage.src = Sun;
    moonImage.src = Moon;
    earthImage.src = Earth;
    function draw() {
      const time = new Date();
      const seconds = time.getSeconds();
      const milliseconds = time.getMilliseconds();
      ctx.clearRect(0, 0, 300, 300);
      // sun
      ctx.save();
      ctx.drawImage(sunImage, 0, 0, 300, 300);
      ctx.restore();

      // earth
      ctx.save();
      ctx.translate(150, 150);
      ctx.rotate(
        ((Math.PI * 2) / 60) * seconds + ((Math.PI * 2) / 60000) * milliseconds
      );
      // moon
      ctx.save();
      ctx.translate(105, 0);
      ctx.rotate(
        ((Math.PI * 2) / 6) * seconds + ((Math.PI * 2) / 6000) * milliseconds
      );
      ctx.translate(28.5, 0);
      ctx.drawImage(moonImage, -3.5, -3.5);
      ctx.restore();

      ctx.translate(105, 0);
      ctx.drawImage(earthImage, -12, -12);
      ctx.restore();

      // ctx.strokeStyle = "red";
      // ctx.moveTo(0, 150);
      // ctx.lineTo(300, 150);
      // ctx.stroke();
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }, []);
  return (
    <div className="min-w-[375px]">
      <canvas
        ref={cEl}
        width="300"
        height="300"
        className="border mx-auto"
      ></canvas>
    </div>
  );
}
export default SolarSystem;
