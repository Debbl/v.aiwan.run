import React, { useEffect, useRef } from "react";
import Particle from "./utils/Particle";

export interface Cursor {
  x: number;
  y: number;
}

const MouseFollowing: React.FC = () => {
  const containerEl = useRef<HTMLDivElement>(null);
  const cEl = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = cEl.current!.getContext("2d")!;
    const { clientWidth, clientHeight } = containerEl.current!;
    const particlesArray: Particle[] = [];
    const cursor: Cursor = {
      x: clientWidth / 2,
      y: clientHeight / 2,
    };
    function main() {
      containerEl.current!.addEventListener<"mousemove">("mousemove", (e) => {
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
      });
      containerEl.current!.addEventListener(
        "touchmove",
        (e) => {
          e.preventDefault();
          cursor.x = e.touches[0].clientX;
          cursor.y = e.touches[0].clientY;
        },
        { passive: false }
      );
      generateParticles(101);
      requestAnimationFrame(anim);
    }
    function anim() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, cEl.current!.clientWidth, cEl.current!.clientHeight);
      particlesArray.forEach((p) => p.rotate(cursor, ctx));
      requestAnimationFrame(anim);
    }
    function generateParticles(amount: number) {
      Array.from({ length: amount }).forEach((_, i) => {
        particlesArray[i] = new Particle(
          clientWidth / 2,
          clientHeight / 2,
          4,
          generateColor(),
          0.02
        );
      });
    }
    function generateColor() {
      const hexSet = "0123456789ABCDEF";
      let finalHexString = "#";
      for (let i = 0; i < 6; i++) {
        finalHexString += hexSet[Math.floor(Math.random() * 16)];
      }
      return finalHexString;
    }
    main();
  }, []);
  return (
    <div
      ref={containerEl}
      className="flex h-screen items-center justify-center"
    >
      <canvas ref={cEl} width="600" height="400" className=""></canvas>
    </div>
  );
};
export default MouseFollowing;
