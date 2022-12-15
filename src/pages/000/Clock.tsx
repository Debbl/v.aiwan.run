import React, { useEffect, useRef } from "react";
import "./style.css";

const Clock: React.FC = () => {
  const cEl = useRef<HTMLCanvasElement>(null);
  const hoursEl = useRef<HTMLDivElement>(null);
  const minutesEl = useRef<HTMLDivElement>(null);
  const secondsEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!cEl.current?.getContext) return;
    const ctx = cEl.current!.getContext("2d")!;

    // CSS 动画函数
    function cssInit() {
      const time = new Date();
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const seconds = time.getSeconds();
      secondsEl.current!.style.animationDelay = `${-seconds}s`;
      minutesEl.current!.style.animationDelay = `-${minutes * 60 + seconds}s`;
      hoursEl.current!.style.animationDelay = `-${
        hours * 60 * 60 + minutes * 60 + seconds
      }s`;
    }
    cssInit();
    function drawBg() {
      ctx.save();
      ctx.translate(150, 150);
      ctx.beginPath();
      ctx.arc(0, 0, 130, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.restore();
    }
    function drawNumbers() {
      ctx.save();
      ctx.translate(150, 150);
      ctx.font = "30px fangsong";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      const numbers = Array.from({ length: 12 }).map((_, i) => `${i + 1}`);
      for (let i = 0; i < numbers.length; i++) {
        const x = Math.sin(((Math.PI * 2) / 12) * (i + 1)) * 100;
        const y = -Math.cos(((Math.PI * 2) / 12) * (i + 1)) * 100;
        ctx.fillText(numbers[i], x, y);
      }
      ctx.fillText("3", 100, 0);
      ctx.restore();
    }
    function drawSecondHand(seconds: number) {
      ctx.save();
      ctx.translate(150, 150);
      ctx.rotate(((Math.PI * 2) / 60) * seconds);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "red";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -80);
      ctx.stroke();
      ctx.restore();
    }
    function drawMinutesHand(minutes: number, seconds: number) {
      ctx.save();
      ctx.translate(150, 150);
      ctx.rotate(
        ((Math.PI * 2) / 60) * minutes + ((Math.PI * 2) / 60 / 60) * seconds
      );
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -70);
      ctx.stroke();
      ctx.restore();
    }
    function drawHourHand(hours: number, minutes: number, seconds: number) {
      ctx.save();
      ctx.translate(150, 150);
      ctx.rotate(
        ((Math.PI * 2) / 12) * hours +
          ((Math.PI * 2) / 12 / 60) * minutes +
          ((Math.PI * 2) / 12 / 60 / 60) * seconds
      );
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -50);
      ctx.stroke();
      ctx.restore();
    }
    function drawCircle() {
      ctx.save();
      ctx.translate(150, 150);

      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    function drawHoursTick() {
      ctx.save();
      ctx.translate(150, 150);
      Array.from({ length: 12 }).forEach(() => {
        ctx.rotate((Math.PI * 2) / 12);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -130);
        ctx.lineTo(0, -122);
        ctx.stroke();
      });
      ctx.restore();
    }
    function drawMinsTick() {
      ctx.save();
      ctx.translate(150, 150);
      Array.from({ length: 60 }).forEach(() => {
        ctx.rotate((Math.PI * 2) / 60);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -130);
        ctx.lineTo(0, -126);
        ctx.stroke();
      });
      ctx.restore();
    }
    function draw() {
      const time = new Date();
      const hours = time.getHours();
      const mins = time.getMinutes();
      const seconds = time.getSeconds();
      ctx.clearRect(0, 0, 300, 300);
      drawBg();
      drawNumbers();
      drawHourHand(hours, mins, seconds);
      drawSecondHand(seconds);
      drawMinutesHand(mins, seconds);
      drawCircle();
      drawHoursTick();
      drawMinsTick();
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }, []);
  return (
    <div className="flex min-w-[300px] flex-col sm:flex-row mt-16 justify-center items-center">
      <canvas
        ref={cEl}
        width="300"
        height="300"
        className="border bg-black rounded-[50px]"
      >
        你的浏览器不支持 Canvas。请升级您的浏览器！
      </canvas>
      <div className="clock-css-container">
        <div className="clock">
          <div ref={hoursEl} className="hand hours"></div>
          <div ref={minutesEl} className="hand minutes"></div>
          <div ref={secondsEl} className="hand seconds"></div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
