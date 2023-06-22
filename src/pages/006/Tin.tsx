import { useEffect, useRef, useState } from "react";
import P5 from "p5";
import colors from "./colors";
import Dot from "./Dot";

const ITEMS_COUNT = 32;

const Tin: React.FC = () => {
  const elRef = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("light");
  const bgTheme = currentTheme === "light" ? "bg-[#fafafa]" : "bg-black";

  const createP5 = (s: (...args: any[]) => any, el?: HTMLElement) => {
    return new P5(s, el);
  };

  useEffect(() => {
    const dots: Dot[] = [];
    let time = 0;
    const sketch = (s: P5) => {
      s.setup = () => {
        s.createCanvas(400, 400);
        s.noStroke();
        s.rectMode(s.RADIUS);
        for (let x = 0; x < ITEMS_COUNT; x++) {
          dots.push(new Dot(s, ITEMS_COUNT, x, x));
        }
      };

      s.draw = () => {
        time += s.deltaTime / 1000;
        s.background(colors[currentTheme].background);

        for (let i = 0; i < dots.length; i++) {
          const x = dots[i].getX();
          const value = Math.sin(x / 4 + time);

          dots[i].setValue(value);
        }
      };

      s.mouseMoved = () => {
        if (s.mouseX < 0 || s.mouseY > s.width || s.mouseY < 0 || s.mouseY > s.height) return;

        const hoveredPointIndex = Math.floor(s.mouseX / (s.width / ITEMS_COUNT));
        dots.forEach((dot, i) => {
          if (i === hoveredPointIndex) {
            dot.setOpacity(200);
          } else {
            dot.setOpacity(255);
          }
        });
      };
    };

    let p5: P5 | null = null;
    const el = elRef.current;
    if (el) p5 = createP5(sketch, el);

    return () => {
      p5 && p5.remove();
    };
  }, [currentTheme]);

  return (
    <div className={`w-screen h-screen fixed flex t-0 justify-center ${bgTheme}`}>
      <div ref={elRef}>Tin</div>
    </div>
  );
};

export default Tin;