import { useState } from "react";

interface Props {
  state: string
}

export default function MemoryInfo({state}: Props) {
  const [x, setX] = useState(true)
  return (
    <>
      <div className={`modal-${x ? state : "inactive"}`} >
        <div className="x" onClick={() => setX(false)}>X</div>
        <h1>Memory Title</h1>
        <h3 id="modal-date">10/10/2007</h3>
        <h3>Description</h3>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione sint
          quidem error quasi dignissimos pariatur odio fugit tempora, libero
          eveniet molestias est. Voluptatibus aspernatur soluta aliquid
          quibusdam maxime quaerat dicta?
        </p>
        <image></image>
      </div>
      <div className={`overlayb-${x ? state : "inactive"}`}></div>
    </>
  );
}
