import { useEffect, useRef } from "react";
import P5 from "p5";
import colors from "./assets/colors";
import Dot from "./composables/Dot";
import { useDark } from "./hooks/useDark";

const ITEMS_COUNT = 32;

const animationPlay = (el: HTMLElement, bgColor: string) => {
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
      s.background(bgColor);

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

  return new P5(sketch, el);
};

const Tin: React.FC = () => {
  const elRef = useRef<HTMLDivElement>(null);
  const [isDark] = useDark();

  const currentTheme = isDark ? "dark" : "light";
  const bgTheme = currentTheme === "light" ? "bg-[#fafafa]" : "bg-black";

  useEffect(() => {
    const p5 = animationPlay(elRef.current!, colors[currentTheme].background);

    return () => {
      p5 && p5.remove();
    };
  }, [currentTheme]);

  return (
    <div className={`fixed flex h-screen w-screen justify-center p-10 ${bgTheme}`}>
      <div ref={elRef}></div>
    </div>
  );
};

export default Tin;
