import EventBus from "./EventBus";

class SignState extends EventBus<{ el: HTMLCanvasElement }> {
  cEl?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  constructor() {
    super();
    this.on("el", this.init);
  }

  init = (cEl: HTMLCanvasElement) => {
    this.cEl = cEl;
    this.ctx = cEl.getContext("2d")!;
    cEl.addEventListener("mousedown", this.mouseDownHandle);
    cEl.addEventListener("mouseup", this.mouseUpHandle);
  };

  removeEvent = () => {
    const cEl = this.cEl!;
    cEl.removeEventListener("mousedown", this.mouseDownHandle);
    cEl.removeEventListener("mousemove", this.mouseMoveHandle);
    cEl.removeEventListener("mouseup", this.mouseUpHandle);
  };

  protected mouseMoveHandle = (e: MouseEvent) => {
    const ctx = this.ctx!;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  };

  protected mouseDownHandle = (e: MouseEvent) => {
    const ctx = this.ctx!;
    const cEl = this.cEl!;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.shadowBlur = 1;
    ctx.moveTo(e.offsetX, e.offsetY);
    cEl.addEventListener("mousemove", this.mouseMoveHandle);
  };

  protected mouseUpHandle = () => {
    const cEl = this.cEl!;
    cEl.removeEventListener("mousemove", this.mouseMoveHandle);
  };
}
export default SignState;
