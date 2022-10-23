import { useEffect, useRef } from "react";
import SignState from "./utils/SignState";

function CanvasSign() {
  const cEl = useRef<HTMLCanvasElement>(null);
  const { current: signState } = useRef(new SignState());
  useEffect(() => {
    signState.emit("el", cEl.current!);
    return () => signState.removeEvent();
  }, []);

  // reset canvas
  // function reset() {
  //   const ctx = cEl.current!.getContext("2d")!;
  //   ctx.save();
  //   ctx.clearRect(0, 0, 400, 400);
  //   ctx.restore();
  // }
  // function undo() {
  //   console.log(snapshotData);

  //   const ctx = cEl.current!.getContext("2d")!;
  //   if (snapshotData.imageData.length === 0) {
  //     reset();
  //     return;
  //   }
  //   if (snapshotData.imageData.length === 1) {
  //     // ctx.putImageData(snapshotData.imageData.pop()!, 0, 0);
  //     reset();
  //     return;
  //   }
  //   snapshotData.index--;
  //   if (snapshotData.index <= 0) snapshotData.index = 0;
  //   snapshotData.imageData.pop();
  //   ctx.putImageData(snapshotData.imageData[snapshotData.index], 0, 0);
  // }
  return (
    <div className="">
      {/* <button onClick={reset}>清除</button>
      <button onClick={undo}>撤销</button> */}
      <canvas
        ref={cEl}
        width="400"
        height="400"
        className="border bg-[#eee]"
      ></canvas>
    </div>
  );
}

export default CanvasSign;
