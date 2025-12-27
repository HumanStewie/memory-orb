import { useState } from "react";
import * as THREE from "three"

interface Props {
  currentImg: React.RefObject<number>;
  nameRef: React.RefObject<any[]>;
  dateRef: React.RefObject<any[]>;
  infoRef: React.RefObject<any[]>;
  imgRef: React.RefObject<any[]>;
}

export default function MemoryInfo({dateRef, infoRef, nameRef, currentImg, imgRef}: Props) {
  dateRef.current[currentImg.current] = dateRef.current[currentImg.current].split("T")[0].split("-").reverse().join("/")
  return (
    <>
      <div className="modal">
        <img id="mem-img" src={imgRef.current[currentImg.current]}></img>
        <div className="text-container">
          <h1>{nameRef.current[currentImg.current]}</h1>
          <h3 id="modal-date">{dateRef.current[currentImg.current]}</h3>
          <h3>Description</h3>
          <p id="model-info">
            {infoRef.current[currentImg.current]}
          </p>
        </div>
       
      </div>
      {/*<div className={`overlayb-${x ? state : "inactive"}`}></div>*/}
    </>
  );
}
