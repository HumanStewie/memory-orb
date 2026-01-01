interface Props {
  currentImg: React.RefObject<number>;
  nameRef: React.RefObject<any[] | null>;
  dateRef: React.RefObject<any[] | null>;
  infoRef: React.RefObject<any[] | null>;
  imgRef: React.RefObject<any[] | null>;
}

export default function MemoryInfo({
  dateRef,
  infoRef,
  nameRef,
  currentImg,
  imgRef,
}: Props) {
  if (dateRef.current) {
    dateRef.current[currentImg.current] = dateRef.current[currentImg.current]
      .split("T")[0]
      .split("-")
      .reverse()
      .join("/");
  }
  return (
    <>
      <div className="modal">
        <img
          id="mem-img"
          src={imgRef.current && imgRef.current[currentImg.current]}
        ></img>
        <div className="text-container">
          <h1>{nameRef.current && nameRef.current[currentImg.current]}</h1>
          <h3 id="modal-date">
            {dateRef.current && dateRef.current[currentImg.current]}
          </h3>
          <h3>Description</h3>
          <p id="model-info">
            {infoRef.current && infoRef.current[currentImg.current]}
          </p>
        </div>
      </div>
    </>
  );
}
