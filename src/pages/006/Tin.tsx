import { useEffect, useMemo, useRef, useState } from "react";
import P5 from "p5";
import colors from "./assets/colors";
import Dot from "./composables/Dot";
import { useDark } from "./hooks/useDark";
import { getMathFn } from "./utils";

export type MathFn = (t: number, i: number, x: number) => number;

const ITEMS_COUNT = 32;

const animationPlay = (el: HTMLElement, bgColor: string, mathFn: MathFn) => {
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
        const value = mathFn(time, i, x);

        dots[i].setValue(value);
      }
    };

    s.mouseMoved = () => {
      if (
        s.mouseX < 0 ||
        s.mouseY > s.width ||
        s.mouseY < 0 ||
        s.mouseY > s.height
      )
        return;

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
  const [fn, setFn] = useState("Math.sin(t + i + x)");
  const [isDark] = useDark();

  const currentTheme = isDark ? "dark" : "light";
  const bgTheme = currentTheme === "light" ? "bg-[#fafafa]" : "bg-black";

  const mathFn: MathFn = useMemo(() => {
    const _fn = getMathFn("t, i, x", fn);

    return (t: number, i: number, x: number) => {
      try {
        return _fn(t, i, x);
      } catch (e) {
        return 1;
      }
    };
  }, [fn]);

  useEffect(() => {
    const p5 = animationPlay(
      elRef.current!,
      colors[currentTheme].background,
      mathFn
    );

    return () => {
      p5 && p5.remove();
    };
  }, [currentTheme, mathFn]);

  return (
    <div
      className={`fixed flex h-screen w-screen flex-col items-center p-10 ${bgTheme}`}
    >
      <div ref={elRef}></div>
      <div className="mt-6 flex flex-col items-start gap-y-2">
        <div className="opacity-30">{"(t, i, x) => "}</div>
        <input
          type="text"
          className="w-96 border-b  border-gray-700 bg-transparent p-2 outline-none"
          value={fn}
          onChange={(e) => setFn(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Tin;
