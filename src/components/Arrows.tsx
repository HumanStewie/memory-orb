interface Props {
  onClickRight: () => void;
}

export default function Arrows({onClickRight} : Props) {
  return (
    <>
      <div className="arrow-right" onClick={onClickRight}></div>
      <div className="arrow-left"></div>
    </>
  );
}
